const CORES = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  AGENDADO: 'bg-blue-100 text-blue-800',
  COLETOR_A_CAMINHO: 'bg-purple-100 text-purple-800',
  EM_COLETA: 'bg-orange-100 text-orange-800',
  CONCLUIDO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800',
};

const LABELS = {
  PENDENTE: 'Pendente',
  AGENDADO: 'Agendado',
  COLETOR_A_CAMINHO: 'Coletor a caminho',
  EM_COLETA: 'Em coleta',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

export default function Badge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CORES[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
