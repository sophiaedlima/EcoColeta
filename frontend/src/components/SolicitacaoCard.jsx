import { useNavigate } from 'react-router-dom';
import Badge from './ui/Badge';

export default function SolicitacaoCard({ solicitacao }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/acompanhamento/${solicitacao.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900 truncate">{solicitacao.endereco}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(solicitacao.criadoEm).toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
          </p>
        </div>
        <Badge status={solicitacao.status} />
      </div>
    </div>
  );
}
