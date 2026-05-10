import { useEffect, useState } from 'react';
import { solicitacoesService, agendamentosService } from '../../services/api';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const STATUS_OPCOES = [
  'PENDENTE', 'AGENDADO', 'COLETOR_A_CAMINHO', 'EM_COLETA', 'CONCLUIDO', 'CANCELADO',
];

export default function PainelAdmin() {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  function carregar() {
    solicitacoesService.listarTodas().then(({ data }) => {
      setSolicitacoes(data);
      setCarregando(false);
    });
  }

  useEffect(() => { carregar(); }, []);

  async function handleStatus(id, status) {
    await agendamentosService.atualizarStatus(id, status);
    carregar();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
          ← Voltar
        </button>
        <h1 className="text-xl font-bold text-green-700">Painel Admin</h1>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {carregando ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Solicitante</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Endereço</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {solicitacoes.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{s.solicitanteEmail}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{s.endereco}</td>
                    <td className="px-4 py-3">
                      <Badge status={s.status} />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        defaultValue=""
                        onChange={(e) => e.target.value && handleStatus(s.id, e.target.value)}
                      >
                        <option value="">Alterar status</option>
                        {STATUS_OPCOES.filter((st) => st !== s.status).map((st) => (
                          <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {solicitacoes.length === 0 && (
              <p className="text-center text-gray-500 py-10">Nenhuma solicitação encontrada.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
