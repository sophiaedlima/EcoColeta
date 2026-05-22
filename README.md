# EcoColeta 

Plataforma web para solicitação, agendamento e rastreamento de coletas de materiais recicláveis.

> Projeto Integrador de Módulo — ADS 4º Período · PUC Goiás · 2026/1

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + TailwindCSS + Socket.io-client |
| Backend | Spring Boot 3 (Java 21) |
| Mensageria | RabbitMQ 3 |
| Banco de dados | PostgreSQL 15 |
| Tempo real | WebSocket (STOMP/SockJS) |
| Qualidade | SonarQube + JaCoCo + ESLint |
| Infraestrutura | Docker + Docker Compose |

---

## Estrutura do repositório

```
ecocoleta/
├── frontend/                  # Aplicação React
│   ├── public/
│   ├── src/
│   │   ├── assets/            # Imagens, ícones
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── ui/            # Design system (Button, Input, Badge...)
│   │   │   ├── StatusTimeline.jsx
│   │   │   └── SolicitacaoCard.jsx
│   │   ├── pages/             # Telas da aplicação
│   │   │   ├── Login.jsx
│   │   │   ├── NovaSolicitacao.jsx
│   │   │   ├── Acompanhamento.jsx
│   │   │   └── admin/
│   │   │       └── PainelAdmin.jsx
│   │   ├── hooks/             # Custom hooks (useWebSocket, useAuth...)
│   │   ├── services/          # Chamadas à API REST
│   │   ├── context/           # AuthContext, WebSocketContext
│   │   └── App.jsx
│   ├── .eslintrc.js
│   └── package.json
│
├── backend/                   # API Spring Boot
│   ├── src/
│   │   ├── main/java/com/ecocoleta/
│   │   │   ├── application/           # Use Cases (portas de entrada)
│   │   │   │   ├── solicitacao/
│   │   │   │   │   ├── CriarSolicitacaoUseCase.java
│   │   │   │   │   └── ListarSolicitacoesUseCase.java
│   │   │   │   ├── agendamento/
│   │   │   │   │   └── AgendarColetaUseCase.java
│   │   │   │   └── coleta/
│   │   │   │       └── AtualizarStatusUseCase.java
│   │   │   ├── domain/                # Entidades e regras de negócio
│   │   │   │   ├── Solicitacao.java
│   │   │   │   ├── Agendamento.java
│   │   │   │   ├── Coleta.java
│   │   │   │   ├── StatusColeta.java  # Enum de estados
│   │   │   │   └── events/
│   │   │   │       └── StatusAtualizadoEvent.java
│   │   │   ├── infrastructure/        # Adaptadores (Driven)
│   │   │   │   ├── persistence/
│   │   │   │   │   ├── SolicitacaoRepository.java
│   │   │   │   │   └── ColetaRepository.java
│   │   │   │   └── messaging/
│   │   │   │       └── RabbitMQPublisher.java
│   │   │   └── adapters/              # Controllers REST (Driving)
│   │   │       ├── SolicitacaoController.java
│   │   │       ├── AgendamentoController.java
│   │   │       └── AuthController.java
│   │   └── test/
│   │       └── java/com/ecocoleta/
│   │           ├── application/       # Testes unitários dos use cases
│   │           └── adapters/          # Testes de integração dos controllers
│   ├── build.gradle
│   └── Dockerfile
│
├── worker/                    # Worker Service (Consumer RabbitMQ)
│   ├── src/main/java/com/ecocoleta/worker/
│   │   ├── consumer/
│   │   │   └── StatusEventConsumer.java
│   │   └── websocket/
│   │       └── StatusWebSocketEmitter.java
│   └── Dockerfile
│
├── docs/                      # Documentação do projeto
│   ├── diagramas-c4.html      # Diagramas C4 interativos
│   ├── plano-de-testes.md
│   ├── roteiro-pitch-5min.md
│   └── figma-link.md          # Link para o protótipo no Figma
│
├── docker-compose.yml         # Sobe todo o ambiente local
├── docker-compose.test.yml    # Ambiente para testes de integração
└── README.md
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
git clone https://github.com/seu-usuario/ecocoleta.git
cd ecocoleta
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

**4. Crie o usuário de teste**

O banco começa vazio, então é necessário registrar uma conta antes de fazer login. Rode o comando abaixo no terminal:

```bash
curl -X POST http://localhost:8080/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","senha":"123456"}'
```

No Windows (PowerShell):

```powershell
Invoke-WebRequest -Uri http://localhost:8080/api/auth/registro `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"usuario@teste.com","senha":"123456"}'
```

**5. Acesse o sistema**

Abra o navegador em **http://localhost:3000** e faça login com:

| Campo | Valor |
|---|---|
| E-mail | `usuario@teste.com` |
| Senha | `123456` |

---

### URLs de acesso

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API Backend | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| RabbitMQ Management | http://localhost:15672 · usuário `guest` · senha `guest` |

---

### Parar o ambiente

```bash
docker compose down
```

Para parar e apagar os dados do banco também:

```bash
docker compose down -v
```

---

### Rodar testes (opcional)

```bash
# Testes unitários e de integração (backend)
cd backend
./gradlew test

# Relatório de cobertura (JaCoCo)
./gradlew jacocoTestReport
# Relatório em: backend/build/reports/jacoco/test/html/index.html

# Lint do frontend
cd frontend
npm run lint
```

---

## Fluxo de estados da coleta

```
Pendente → Agendado → Coletor a caminho → Em coleta → Concluído
                                                     ↘ Cancelado
```

---

## Branches

| Branch | Propósito |
|---|---|
| `main` | Código estável, pronto para entrega |
| `develop` | Integração das features |
| `feature/nome-da-feature` | Desenvolvimento de cada funcionalidade |
| `hotfix/nome-do-fix` | Correções urgentes em produção |

---

## Integrantes

| Nome | Responsabilidade |
|---|---|
| [Nome 1] | Frontend (React) + Design System (Figma) |
| [Nome 2] | Backend (API REST + DDD + Auth JWT) |
| [Nome 3] | Mensageria (RabbitMQ + Worker + WebSocket) + Qualidade |

---

## Código — Backend (Spring Boot 3 · Java 21)

### `backend/build.gradle`

```groovy
plugins {
    id 'org.springframework.boot' version '3.2.5'
    id 'io.spring.dependency-management' version '1.1.4'
    id 'java'
    id 'jacoco'
}

group = 'com.ecocoleta'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '21'

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-amqp'
    implementation 'org.springframework.boot:spring-boot-starter-websocket'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0'
    implementation 'com.auth0:java-jwt:4.4.0'
    runtimeOnly 'org.postgresql:postgresql'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
}

jacoco {
    toolVersion = '0.8.11'
}

test { finalizedBy jacocoTestReport }
```

### `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ecocoleta
    username: ${DB_USER:ecocoleta}
    password: ${DB_PASS:ecocoleta}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  rabbitmq:
    host: ${RABBITMQ_HOST:localhost}
    port: 5672
    username: guest
    password: guest

ecocoleta:
  jwt:
    secret: ${JWT_SECRET:dev-secret-change-in-prod}
    expiration-ms: 86400000   # 24 h

rabbitmq:
  exchange: ecocoleta.exchange
  queue:
    status: ecocoleta.status.queue
  routing-key:
    status: status.atualizado
```

### `domain/Solicitacao.java`

```java
package com.ecocoleta.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "solicitacoes")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String solicitanteEmail;

    @Column(nullable = false)
    private String endereco;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusColeta status = StatusColeta.PENDENTE;

    private LocalDateTime criadoEm = LocalDateTime.now();
    private LocalDateTime atualizadoEm;

    // getters e setters omitidos por brevidade
}
```

### `domain/StatusColeta.java`

```java
package com.ecocoleta.domain;

public enum StatusColeta {
    PENDENTE,
    AGENDADO,
    COLETOR_A_CAMINHO,
    EM_COLETA,
    CONCLUIDO,
    CANCELADO
}
```

### `application/solicitacao/CriarSolicitacaoUseCase.java`

```java
package com.ecocoleta.application.solicitacao;

import com.ecocoleta.domain.Solicitacao;
import com.ecocoleta.infrastructure.persistence.SolicitacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CriarSolicitacaoUseCase {

    private final SolicitacaoRepository repository;

    public CriarSolicitacaoUseCase(SolicitacaoRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Solicitacao executar(String email, String endereco) {
        var solicitacao = new Solicitacao();
        solicitacao.setSolicitanteEmail(email);
        solicitacao.setEndereco(endereco);
        return repository.save(solicitacao);
    }
}
```

### `application/coleta/AtualizarStatusUseCase.java`

```java
package com.ecocoleta.application.coleta;

import com.ecocoleta.domain.StatusColeta;
import com.ecocoleta.domain.events.StatusAtualizadoEvent;
import com.ecocoleta.infrastructure.messaging.RabbitMQPublisher;
import com.ecocoleta.infrastructure.persistence.SolicitacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class AtualizarStatusUseCase {

    private final SolicitacaoRepository repository;
    private final RabbitMQPublisher publisher;

    public AtualizarStatusUseCase(SolicitacaoRepository repository,
                                   RabbitMQPublisher publisher) {
        this.repository = repository;
        this.publisher = publisher;
    }

    @Transactional
    public void executar(UUID solicitacaoId, StatusColeta novoStatus) {
        var solicitacao = repository.findById(solicitacaoId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));

        solicitacao.setStatus(novoStatus);
        repository.save(solicitacao);

        publisher.publicar(new StatusAtualizadoEvent(solicitacaoId, novoStatus));
    }
}
```

### `adapters/SolicitacaoController.java`

```java
package com.ecocoleta.adapters;

import com.ecocoleta.application.solicitacao.CriarSolicitacaoUseCase;
import com.ecocoleta.application.solicitacao.ListarSolicitacoesUseCase;
import com.ecocoleta.domain.Solicitacao;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
@Tag(name = "Solicitações")
public class SolicitacaoController {

    private final CriarSolicitacaoUseCase criarUseCase;
    private final ListarSolicitacoesUseCase listarUseCase;

    public SolicitacaoController(CriarSolicitacaoUseCase criarUseCase,
                                  ListarSolicitacoesUseCase listarUseCase) {
        this.criarUseCase = criarUseCase;
        this.listarUseCase = listarUseCase;
    }

    @Operation(summary = "Cria uma nova solicitação de coleta")
    @PostMapping
    public ResponseEntity<Solicitacao> criar(@Valid @RequestBody NovaSolicitacaoRequest req) {
        var solicitacao = criarUseCase.executar(req.email(), req.endereco());
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacao);
    }

    @Operation(summary = "Lista todas as solicitações do usuário autenticado")
    @GetMapping
    public ResponseEntity<List<Solicitacao>> listar() {
        return ResponseEntity.ok(listarUseCase.executar());
    }

    public record NovaSolicitacaoRequest(
            @jakarta.validation.constraints.Email String email,
            @jakarta.validation.constraints.NotBlank String endereco
    ) {}
}
```

### `infrastructure/messaging/RabbitMQPublisher.java`

```java
package com.ecocoleta.infrastructure.messaging;

import com.ecocoleta.domain.events.StatusAtualizadoEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key.status}")
    private String routingKey;

    public RabbitMQPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publicar(StatusAtualizadoEvent event) {
        rabbitTemplate.convertAndSend(exchange, routingKey, event);
    }
}
```

### `worker/consumer/StatusEventConsumer.java`

```java
package com.ecocoleta.worker.consumer;

import com.ecocoleta.domain.events.StatusAtualizadoEvent;
import com.ecocoleta.worker.websocket.StatusWebSocketEmitter;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class StatusEventConsumer {

    private final StatusWebSocketEmitter emitter;

    public StatusEventConsumer(StatusWebSocketEmitter emitter) {
        this.emitter = emitter;
    }

    @RabbitListener(queues = "${rabbitmq.queue.status}")
    public void consumir(StatusAtualizadoEvent event) {
        emitter.emitir(event.solicitacaoId().toString(), event.novoStatus().name());
    }
}
```

### `worker/websocket/StatusWebSocketEmitter.java`

```java
package com.ecocoleta.worker.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class StatusWebSocketEmitter {

    private final SimpMessagingTemplate messagingTemplate;

    public StatusWebSocketEmitter(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void emitir(String solicitacaoId, String status) {
        messagingTemplate.convertAndSend(
                "/topic/coleta/" + solicitacaoId,
                new StatusPayload(solicitacaoId, status)
        );
    }

    public record StatusPayload(String solicitacaoId, String status) {}
}
```

---

## Código — Frontend (React 18 · TailwindCSS)

### `frontend/package.json`

```json
{
  "name": "ecocoleta-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint src --ext .js,.jsx",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1",
    "axios": "^1.7.2",
    "@stomp/stompjs": "^7.0.0",
    "sockjs-client": "^1.6.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.2.12",
    "tailwindcss": "^3.4.4",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.2"
  }
}
```

### `frontend/src/services/api.js`

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const solicitacoesService = {
  criar: (data) => api.post('/solicitacoes', data),
  listar: () => api.get('/solicitacoes'),
  buscar: (id) => api.get(`/solicitacoes/${id}`),
};

export const authService = {
  login: (email, senha) => api.post('/auth/login', { email, senha }),
};

export default api;
```

### `frontend/src/hooks/useWebSocket.js`

```js
import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useWebSocket(solicitacaoId) {
  const [status, setStatus] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!solicitacaoId) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8080'}/ws`),
      onConnect: () => {
        client.subscribe(`/topic/coleta/${solicitacaoId}`, (message) => {
          const payload = JSON.parse(message.body);
          setStatus(payload.status);
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, [solicitacaoId]);

  return status;
}
```

### `frontend/src/context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario');
    return salvo ? JSON.parse(salvo) : null;
  });

  async function login(email, senha) {
    const { data } = await authService.login(email, senha);
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### `frontend/src/pages/NovaSolicitacao.jsx`

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { solicitacoesService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function NovaSolicitacao() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [endereco, setEndereco] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const { data } = await solicitacoesService.criar({
        email: usuario.email,
        endereco,
      });
      navigate(`/acompanhamento/${data.id}`);
    } catch {
      setErro('Não foi possível criar a solicitação. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Nova Solicitação de Coleta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Endereço para coleta
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
            placeholder="Rua, número, bairro"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>
        {erro && <p className="text-red-600 text-sm">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          {carregando ? 'Enviando...' : 'Solicitar Coleta'}
        </button>
      </form>
    </div>
  );
}
```

### `frontend/src/pages/Acompanhamento.jsx`

```jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { solicitacoesService } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import StatusTimeline from '../components/StatusTimeline';

export default function Acompanhamento() {
  const { id } = useParams();
  const [solicitacao, setSolicitacao] = useState(null);
  const statusAtualizado = useWebSocket(id);

  useEffect(() => {
    solicitacoesService.buscar(id).then(({ data }) => setSolicitacao(data));
  }, [id]);

  const statusExibido = statusAtualizado ?? solicitacao?.status;

  if (!solicitacao) return <p className="text-center mt-20 text-gray-500">Carregando...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold text-green-700 mb-2">Acompanhe sua Coleta</h1>
      <p className="text-gray-500 text-sm mb-6">Endereço: {solicitacao.endereco}</p>
      <StatusTimeline statusAtual={statusExibido} />
    </div>
  );
}
```

### `frontend/src/components/StatusTimeline.jsx`

```jsx
const ETAPAS = [
  { key: 'PENDENTE', label: 'Pendente' },
  { key: 'AGENDADO', label: 'Agendado' },
  { key: 'COLETOR_A_CAMINHO', label: 'Coletor a caminho' },
  { key: 'EM_COLETA', label: 'Em coleta' },
  { key: 'CONCLUIDO', label: 'Concluído' },
];

export default function StatusTimeline({ statusAtual }) {
  const indexAtual = ETAPAS.findIndex((e) => e.key === statusAtual);

  return (
    <ol className="relative border-l border-gray-200 ml-3">
      {ETAPAS.map((etapa, i) => {
        const concluido = i < indexAtual;
        const atual = i === indexAtual;
        return (
          <li key={etapa.key} className="mb-6 ml-6">
            <span
              className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white
                ${concluido ? 'bg-green-500' : atual ? 'bg-green-300 animate-pulse' : 'bg-gray-200'}`}
            />
            <p
              className={`text-sm font-medium ${
                atual ? 'text-green-700' : concluido ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {etapa.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
```

### `frontend/src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import NovaSolicitacao from './pages/NovaSolicitacao';
import Acompanhamento from './pages/Acompanhamento';
import PainelAdmin from './pages/admin/PainelAdmin';

function RotaProtegida({ children, apenasAdmin = false }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (apenasAdmin && usuario.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RotaProtegida>
                <NovaSolicitacao />
              </RotaProtegida>
            }
          />
          <Route
            path="/acompanhamento/:id"
            element={
              <RotaProtegida>
                <Acompanhamento />
              </RotaProtegida>
            }
          />
          <Route
            path="/admin"
            element={
              <RotaProtegida apenasAdmin>
                <PainelAdmin />
              </RotaProtegida>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## Links importantes

- [Protótipo no Figma](https://figma.com/...)
- [Diagramas C4](./docs/diagramas-c4.html)
- [Plano de Testes](./docs/plano-de-testes.md)
- [Documento Norteador (PUC Goiás)](./docs/norteador.pdf)
