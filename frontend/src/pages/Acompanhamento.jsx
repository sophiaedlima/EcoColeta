import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { solicitacoesService } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';

const ETAPAS = [
  { key: 'PENDENTE',          label: 'Pendente' },
  { key: 'AGENDADO',          label: 'Agendado' },
  { key: 'COLETOR_A_CAMINHO', label: 'Coletor a caminho' },
  { key: 'EM_COLETA',         label: 'Em coleta' },
  { key: 'CONCLUIDO',         label: 'Concluído' },
];

const STATUS_LABEL = {
  PENDENTE: 'Pendente', AGENDADO: 'Agendado', COLETOR_A_CAMINHO: 'Coletor a caminho',
  EM_COLETA: 'Em coleta', CONCLUIDO: 'Concluído', CANCELADO: 'Cancelado',
};

export default function Acompanhamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solicitacao, setSolicitacao] = useState(null);
  const statusRT = useWebSocket(id);

  useEffect(() => {
    solicitacoesService.buscar(id).then(({ data }) => setSolicitacao(data));
  }, [id]);

  const status = statusRT ?? solicitacao?.status;
  const indexAtual = ETAPAS.findIndex(e => e.key === status);

  if (!solicitacao) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0' }}>
        <p style={{ color: '#aaa' }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header verde */}
      <div style={{ background: '#3a5a42', padding: '14px 16px 18px' }}>
        <button onClick={() => navigate('/')} style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 16, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 3 }}>Solicitação</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 14 }}>{solicitacao.endereco}</div>

        {/* Status card */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5cc97a', boxShadow: '0 0 0 3px rgba(92,201,122,0.25)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{STATUS_LABEL[status] || status}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Atualizado automaticamente</div>
          </div>
          {statusRT && (
            <div style={{ padding: '3px 9px', borderRadius: 20, background: 'rgba(92,201,122,0.2)', border: '1px solid rgba(92,201,122,0.4)', fontSize: 10, color: '#5cc97a', fontWeight: 600, whiteSpace: 'nowrap' }}>
              ao vivo
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        {/* Mapa placeholder */}
        <div style={{ background: '#e0ebe2', borderRadius: 12, border: '1px solid #ccc', overflow: 'hidden' }}>
          <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #d4e8d8, #bcd8c4)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <span style={{ fontSize: 34, position: 'relative', zIndex: 1 }}>📍</span>
          </div>
          <div style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
            <div style={{ fontSize: 12, color: '#555' }}>{solicitacao.endereco}</div>
            <div style={{ padding: '3px 9px', borderRadius: 20, background: '#ecf7ef', color: '#3a5a42', fontSize: 10, fontWeight: 600 }}>
              {status === 'COLETOR_A_CAMINHO' ? '~15 min' : '—'}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 2 }}>Histórico</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {ETAPAS.map((etapa, i) => {
            const concluido = i < indexAtual;
            const atual = i === indexAtual;
            const pendente = i > indexAtual;
            const check = concluido || (atual && etapa.key === 'AGENDADO');
            return (
              <div key={etapa.key} style={{ display: 'flex', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, border: '2px solid',
                    background: check ? '#3a5a42' : atual ? '#e8f5ec' : '#fff',
                    borderColor: check ? '#3a5a42' : atual ? '#5cc97a' : '#ccc',
                    color: check ? '#fff' : atual ? '#3a5a42' : '#aaa', flexShrink: 0,
                  }}>
                    {check ? '✓' : atual ? '→' : '○'}
                  </div>
                  {i < ETAPAS.length - 1 && (
                    <div style={{ flex: 1, width: 2, background: concluido ? '#5cc97a' : '#e0e0e0', margin: '3px 0', minHeight: 20 }} />
                  )}
                </div>
                <div style={{ paddingBottom: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: pendente ? '#aaa' : '#222' }}>{etapa.label}</div>
                  <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                    {concluido ? 'Concluído' : atual ? 'Confirmado' : 'Aguardando…'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
