# EcoColeta 

Plataforma web para solicitação, agendamento e rastreamento de coletas de materiais recicláveis.

> Projeto Integrador de Módulo — ADS 4º Período · PUC Goiás · 2026/1

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + React Router |
| Backend | Spring Boot 3 (Java 21) |
| Mensageria | RabbitMQ 3 |
| Banco de dados | PostgreSQL 15 |
| Tempo real | WebSocket (STOMP/SockJS) |
| Infraestrutura | Docker + Docker Compose + nginx |

---

## Telas da aplicação

| Rota | Tela | Acesso |
|---|---|---|
| `/login` | Login | Público |
| `/` | Home — lista de solicitações | Usuário |
| `/nova` | Nova solicitação de coleta | Usuário |
| `/rastrear` | Rastrear — acompanhar status das coletas | Usuário |
| `/acompanhamento/:id` | Detalhe da coleta com timeline | Usuário |
| `/perfil` | Perfil do usuário e estatísticas | Usuário |
| `/admin` | Painel admin — gerenciar e agendar coletas | Admin |

---

## Estrutura do repositório

```
ecocoleta/
├── frontend/
│   └── src/
│       ├── components/
│       │   └── BottomNav.jsx          # Navegação inferior
│       ├── context/
│       │   └── AuthContext.jsx        # Autenticação + JWT
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Home.jsx
│       │   ├── NovaSolicitacao.jsx
│       │   ├── Rastrear.jsx
│       │   ├── Acompanhamento.jsx
│       │   ├── Perfil.jsx
│       │   └── admin/
│       │       └── PainelAdmin.jsx
│       ├── services/
│       │   └── api.js                 # Chamadas à API REST (axios)
│       └── App.jsx
│
├── backend/
│   └── src/main/java/com/ecocoleta/
│       ├── adapters/                  # Controllers REST
│       │   ├── AuthController.java
│       │   ├── SolicitacaoController.java
│       │   └── AgendamentoController.java
│       ├── application/               # Use Cases
│       │   ├── solicitacao/
│       │   ├── agendamento/
│       │   └── coleta/
│       ├── domain/                    # Entidades e enums
│       └── infrastructure/            # JPA, RabbitMQ
│
├── worker/                            # Consumer RabbitMQ + WebSocket
├── docker-compose.yml
└── README.md
```

---

## Arquitetura e Padrões de Projeto

### Arquitetura Hexagonal (Ports & Adapters)

O backend é estruturado em quatro camadas com dependências de fora para dentro:

```
adapters (Controllers REST)
    ↓
application (Use Cases)
    ↓
domain (Entidades, Enums, Events)
    ↑
infrastructure (JPA, RabbitMQ) ← implementa contratos do domain
```

Essa separação garante que o domínio de negócio não depende de frameworks. Os use cases orquestram as regras; os controllers e repositórios são detalhes de infraestrutura.

### Padrões aplicados

| Padrão | Onde está | Por quê |
|---|---|---|
| **Use Case** | `application/solicitacao/`, `application/agendamento/`, `application/coleta/` | Cada operação de negócio tem uma classe única com responsabilidade bem definida (SRP do SOLID) |
| **Repository** | `SolicitacaoRepository`, `AgendamentoRepository`, `UsuarioRepository` | Abstrai o acesso a dados; o domínio depende da interface, não do JPA |
| **Dependency Injection** | Todos os serviços e controllers | Constructor injection via Spring — sem acoplamento direto entre classes |
| **Strategy (implícito)** | `StatusColeta` enum + `AtualizarStatusUseCase` | O comportamento de transição de status é encapsulado no enum; adicionar um novo status não exige alterar o use case |
| **Publisher/Subscriber** | `RabbitMQPublisher` → RabbitMQ → `StatusEventConsumer` | Desacopla backend e worker; o backend não sabe quem consome o evento |
| **DTO / Record** | `LoginRequest`, `NovaSolicitacaoRequest`, `AgendarRequest` | Separa o contrato da API das entidades de domínio |

### Fluxo assíncrono (Mensageria)

```
Admin chama PATCH /agendamentos/{id}/status
        ↓
AtualizarStatusUseCase atualiza banco + publica evento
        ↓
RabbitMQ (exchange: ecocoleta.status)
        ↓
Worker (StatusEventConsumer) consome o evento
        ↓
WebSocket STOMP emite para /topic/coleta/{id}
        ↓
Frontend atualiza a tela em tempo real
```

---

## Como rodar pela primeira vez

### O que você precisa ter instalado

Apenas o **Docker Desktop** — ele já inclui o Docker Compose.

- [Download Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows, Mac ou Linux)

> Não é necessário instalar Java, Node.js, PostgreSQL ou RabbitMQ. Tudo roda dentro do Docker.

---

### Passo a passo

**1. Clone o repositório**

```bash
git clone https://github.com/sophiaedlima/EcoQueue.git
cd EcoQueue
```

**2. Suba todos os serviços**

```bash
docker compose up -d --build
```

Esse comando baixa as imagens, compila o backend e o frontend, e sobe os containers. Na primeira vez pode demorar alguns minutos.

**3. Verifique se tudo está rodando**

```bash
docker compose ps
```

Todos os serviços devem aparecer com status `Up` ou `healthy`:

| Container | Status esperado |
|---|---|
| ecocoleta-postgres-1 | Up (healthy) |
| ecocoleta-rabbitmq-1 | Up (healthy) |
| ecocoleta-backend-1 | Up |
| ecocoleta-worker-1 | Up |
| ecocoleta-frontend-1 | Up |

**4. Crie o usuário comum de teste**

O banco começa vazio. Registre uma conta antes de fazer login:

**Linux / Mac / Git Bash:**
```bash
curl -X POST http://localhost:8082/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","senha":"123456"}'
```

**Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri http://localhost:8082/api/auth/registro `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"usuario@teste.com","senha":"123456"}'
```

**5. Acesse o sistema**

Abra o navegador em **http://localhost** e faça login com:

| Campo | Valor |
|---|---|
| E-mail | `usuario@teste.com` |
| Senha | `123456` |

---

## Criando um usuário Admin

O painel administrativo exige uma conta com role `ADMIN`. Siga os passos:

**1. Registre a conta admin normalmente:**

```bash
curl -X POST http://localhost:8082/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@teste.com","senha":"123456"}'
```

**Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri http://localhost:8082/api/auth/registro `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@teste.com","senha":"123456"}'
```

**2. Eleve para ADMIN via SQL no banco:**

```bash
docker exec -it ecocoleta-postgres-1 psql -U ecocoleta -d ecocoleta \
  -c "UPDATE usuarios SET role = 'ADMIN' WHERE email = 'admin@teste.com';"
```

**Windows (PowerShell):**
```powershell
docker exec -it ecocoleta-postgres-1 psql -U ecocoleta -d ecocoleta `
  -c "UPDATE usuarios SET role = 'ADMIN' WHERE email = 'admin@teste.com';"
```

**3. Faça login com as credenciais admin:**

Acesse **http://localhost/login** e entre com:

| Campo | Valor |
|---|---|
| E-mail | `admin@teste.com` |
| Senha | `123456` |

Ao fazer login, o sistema detecta o role `ADMIN` e redireciona automaticamente para o **Painel Admin** (`/admin`).

---

## Credenciais de teste

| Perfil | E-mail | Senha | Acesso |
|---|---|---|---|
| Usuário comum | `usuario@teste.com` | `123456` | Home, Nova solicitação, Rastrear, Perfil |
| Administrador | `admin@teste.com` | `123456` | Painel Admin (agendamento de coletas) |

---

## O que cada perfil pode fazer

### Usuário comum
- Criar solicitações de coleta com:
  - Até 5 fotos dos materiais (JPG/PNG, máx 5 MB cada)
  - Seleção dos tipos de material (Papelão, Plástico, Metal, Vidro, Eletrônico, Madeira)
  - Endereço de coleta
  - Data preferida (próximos 7 dias)
  - Horário preferido (08h–10h, 10h–12h, 14h–16h, 16h–18h)
  - Observações livres
- Ver todas as suas solicitações na Home com os status:
  - **Coleta solicitada** — aguardando confirmação do admin
  - **Confirmado** — admin confirmou o agendamento
  - **Coletor a caminho** / **Em coleta** / **✓ Concluído**
- Rastrear status em tempo real com barra de progresso (aba Rastrear)
- Ver timeline detalhada de cada coleta (Acompanhamento)
- Ver perfil com estatísticas de coletas (aba Perfil)

### Admin
- Ver todas as solicitações de todos os usuários com foto de capa e preferência de data/horário
- Confirmar agendamento: visualizar fotos, materiais e observações do usuário, e definir o nome do coletor — a data e horário já vêm da preferência do usuário
- Atualizar status das coletas via API

---

## URLs de acesso

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API Backend (direto) | http://localhost:8082/api |
| Swagger UI | http://localhost:8082/swagger-ui/index.html |
| RabbitMQ Management | http://localhost:15672 |

---

## Como acessar o Swagger UI

O Swagger UI é a interface visual para testar todos os endpoints da API sem precisar de nenhuma ferramenta extra.

**1. Abra no navegador:**

```
http://localhost:8082/swagger-ui/index.html
```

**2. Faça login para obter o token JWT:**

- Expanda o grupo **Autenticação**
- Clique em `POST /api/auth/login` → **Try it out**
- Preencha o body e clique **Execute**:

```json
{ "email": "usuario@teste.com", "senha": "123456" }
```

- Copie o valor do campo `token` na resposta

**3. Autorize todas as requisições:**

- Clique no botão **Authorize** (cadeado) no topo da página
- Cole o token no campo `Value` no formato: `Bearer <seu-token>`
- Clique **Authorize** e depois **Close**

A partir daí, todos os endpoints protegidos usam o token automaticamente.

**Endpoints disponíveis:**

| Grupo | Método | Rota | Acesso |
|---|---|---|---|
| Autenticação | POST | `/api/auth/registro` | Público |
| Autenticação | POST | `/api/auth/login` | Público |
| Solicitações | POST | `/api/solicitacoes` | Usuário |
| Solicitações | GET | `/api/solicitacoes` | Usuário |
| Solicitações | GET | `/api/solicitacoes/{id}` | Usuário |
| Solicitações | GET | `/api/solicitacoes/admin` | Admin |
| Agendamentos | POST | `/api/agendamentos` | Admin |
| Agendamentos | PATCH | `/api/agendamentos/{id}/status` | Admin |

---

## Como acessar o RabbitMQ

O RabbitMQ Management é o painel web do broker de mensagens. Permite visualizar filas, exchanges, mensagens em trânsito e conexões ativas.

**1. Abra no navegador:**

```
http://localhost:15672
```

**2. Faça login:**

| Campo | Valor |
|---|---|
| Username | `guest` |
| Password | `guest` |

**O que observar no painel:**

- **Queues** → `ecocoleta.status.queue`: mostra mensagens publicadas e consumidas. Cada vez que o admin atualiza um status, uma mensagem passa por essa fila.
- **Exchanges** → `ecocoleta.exchange`: o backend publica os eventos aqui com a routing key `status.atualizado`.
- **Connections**: mostra as conexões abertas pelo backend (publisher) e pelo worker (consumer).

---

## Fluxo de status da coleta

| Status interno | O usuário vê | Quem define |
|---|---|---|
| `PENDENTE` | Coleta solicitada | Automático ao criar |
| `AGENDADO` | Confirmado | Admin ao confirmar agendamento |
| `COLETOR_A_CAMINHO` | Coletor a caminho | Admin via API |
| `EM_COLETA` | Em coleta | Admin via API |
| `CONCLUIDO` | ✓ Concluído | Admin via API |
| `CANCELADO` | Cancelado | Admin via API |

```
PENDENTE → AGENDADO → COLETOR_A_CAMINHO → EM_COLETA → CONCLUIDO
                                                      ↘ CANCELADO
```

O usuário acompanha em tempo real pela tela de Rastrear e Acompanhamento. O admin gerencia pelo Painel Admin ou diretamente pela API.

---

## Parar o ambiente

```bash
docker compose down
```

Para parar e apagar todos os dados do banco:

```bash
docker compose down -v
```

---

## Principais endpoints da API

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/auth/registro` | Público | Registrar novo usuário |
| POST | `/api/auth/login` | Público | Fazer login (retorna JWT) |
| POST | `/api/solicitacoes` | Usuário | Criar solicitação (com fotos, materiais, data/horário preferidos) |
| GET | `/api/solicitacoes` | Usuário | Listar minhas solicitações |
| GET | `/api/solicitacoes/{id}` | Usuário | Buscar solicitação por ID |
| GET | `/api/solicitacoes/admin` | Admin | Listar todas as solicitações |
| POST | `/api/agendamentos` | Admin | Confirmar agendamento (define coletor, usa data/horário do usuário) |
| PATCH | `/api/agendamentos/{id}/status` | Admin | Atualizar status da coleta |

### Campos aceitos em `POST /api/solicitacoes`

```json
{
  "email": "usuario@teste.com",
  "endereco": "Rua das Flores, 142",
  "materiais": "[\"papelao\",\"vidro\"]",
  "observacoes": "3 caixas de papelão e garrafas",
  "imagens": "[\"data:image/jpeg;base64,...\"]",
  "dataPreferida": "2026-05-15",
  "horarioPreferido": "10h–12h"
}
```

Documentação completa: **http://localhost:8082/swagger-ui/index.html**

---

## Branches

| Branch | Propósito |
|---|---|
| `main` | Código estável, pronto para entrega |
| `master` | Branch de desenvolvimento |

---

## Integrantes

| Nome | Responsabilidade |
|---|---|
| Gabriel Brito Falcão | Frontend (React) + Design |
| Hemily B. de Jesus Ramos | Backend (API REST + DDD + Auth JWT) |
| Sophia Eduarda Lima | Mensageria (RabbitMQ + Worker + WebSocket) |
