const ETAPAS = [
  { key: 'PENDENTE', label: 'Pendente' },
  { key: 'AGENDADO', label: 'Agendado' },
  { key: 'COLETOR_A_CAMINHO', label: 'Coletor a caminho' },
  { key: 'EM_COLETA', label: 'Em coleta' },
  { key: 'CONCLUIDO', label: 'Concluído' },
];

export default function StatusTimeline({ statusAtual }) {
  const indexAtual = ETAPAS.findIndex((e) => e.key === statusAtual);
  const cancelado = statusAtual === 'CANCELADO';

  return (
    <div>
      {cancelado && (
        <p className="mb-4 text-red-600 font-medium">Esta coleta foi cancelada.</p>
      )}
      <ol className="relative border-l border-gray-200 ml-3">
        {ETAPAS.map((etapa, i) => {
          const concluido = i < indexAtual;
          const atual = i === indexAtual && !cancelado;
          return (
            <li key={etapa.key} className="mb-8 ml-6">
              <span
                className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white
                  ${concluido ? 'bg-green-500' : atual ? 'bg-green-300 animate-pulse' : 'bg-gray-200'}`}
              >
                {concluido && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <p className={`text-sm font-medium ${atual ? 'text-green-700' : concluido ? 'text-gray-700' : 'text-gray-400'}`}>
                {etapa.label}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
