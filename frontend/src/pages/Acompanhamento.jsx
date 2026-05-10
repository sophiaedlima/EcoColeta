import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { solicitacoesService } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import StatusTimeline from '../components/StatusTimeline';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function Acompanhamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solicitacao, setSolicitacao] = useState(null);
  const statusEmTempoReal = useWebSocket(id);

  useEffect(() => {
    solicitacoesService.buscar(id).then(({ data }) => setSolicitacao(data));
  }, [id]);

  const statusExibido = statusEmTempoReal ?? solicitacao?.status;

  if (!solicitacao) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
          ← Voltar
        </button>
        <h1 className="text-xl font-bold text-green-700">Acompanhamento</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-900">{solicitacao.endereco}</p>
              <p className="text-xs text-gray-500 mt-1">
                Solicitado em{' '}
                {new Date(solicitacao.criadoEm).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
            <Badge status={statusExibido} />
          </div>

          <hr className="my-4 border-gray-100" />

          <StatusTimeline statusAtual={statusExibido} />

          {statusEmTempoReal && (
            <p className="mt-4 text-xs text-green-600 font-medium animate-pulse">
              ● Atualizado em tempo real
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
