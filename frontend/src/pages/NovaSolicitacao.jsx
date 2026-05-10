import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { solicitacoesService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SolicitacaoCard from '../components/SolicitacaoCard';

export default function NovaSolicitacao() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [endereco, setEndereco] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    solicitacoesService.listar().then(({ data }) => setSolicitacoes(data));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const { data } = await solicitacoesService.criar({ email: usuario.email, endereco });
      navigate(`/acompanhamento/${data.id}`);
    } catch {
      setErro('Não foi possível criar a solicitação. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-700">EcoColeta ♻️</h1>
        <div className="flex items-center gap-4">
          {usuario?.role === 'ADMIN' && (
            <button onClick={() => navigate('/admin')} className="text-sm text-green-700 font-medium hover:underline">
              Painel Admin
            </button>
          )}
          <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-8">
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Nova Solicitação de Coleta</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Endereço para coleta"
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
              placeholder="Rua, número, bairro"
            />
            {erro && <p className="text-red-600 text-sm">{erro}</p>}
            <Button type="submit" disabled={carregando}>
              {carregando ? 'Enviando...' : 'Solicitar Coleta'}
            </Button>
          </form>
        </section>

        {solicitacoes.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Minhas Solicitações</h2>
            <div className="flex flex-col gap-3">
              {solicitacoes.map((s) => (
                <SolicitacaoCard key={s.id} solicitacao={s} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
