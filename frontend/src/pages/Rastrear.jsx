import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { solicitacoesService } from '../services/api';
import BottomNav from '../components/BottomNav';

const BADGE = {
  PENDENTE:          { bg: '#fef3dc', color: '#7a5010', label: 'Pendente' },
  AGENDADO:          { bg: '#ddeeff', color: '#1a4ab0', label: 'Agendado' },
  COLETOR_A_CAMINHO: { bg: '#ffe8cc', color: '#7a3a00', label: 'Coletor a caminho' },
  EM_COLETA:         { bg: '#ffe8cc', color: '#7a3a00', label: 'Em coleta' },
  CONCLUIDO:         { bg: '#d8f0de', color: '#1a4a2a', label: 'Concluído' },
  CANCELADO:         { bg: '#ffe0e0', color: '#7a0000', label: 'Cancelado' },
};

const STEPS = ['PENDENTE', 'AGENDADO', 'COLETOR_A_CAMINHO', 'EM_COLETA', 'CONCLUIDO'];

function ProgressBar({ status }) {
  const idx = STEPS.indexOf(status);
  const pct = status === 'CANCELADO' ? 0 : Math.round(((idx < 0 ? 0 : idx) / (STEPS.length - 1)) * 100);
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 4, borderRadius: 4, background: '#e8e8e8', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: status === 'CONCLUIDO' ? '#3a5a42' : '#5cc97a', borderRadius: 4, transition: 'width 0.4s' }} />
      </div>
    </div>
  );
}

export default function Rastrear() {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    solicitacoesService.listar()
      .then(({ data }) => setSolicitacoes(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ativas = solicitacoes.filter(s => s.status !== 'CONCLUIDO' && s.status !== 'CANCELADO');
  const finalizadas = solicitacoes.filter(s => s.status === 'CONCLUIDO' || s.status === 'CANCELADO');

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#3a5a42', padding: '16px 16px 14px' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 600, color: '#fff' }}>Rastrear</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Acompanhe suas coletas</div>
      </div>

      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', paddingBottom: 80 }}>
        {loading && <div style={{ textAlign: 'center', color: '#aaa', padding: '40px 0', fontSize: 13 }}>Carregando...</div>}

        {!loading && solicitacoes.length === 0 && (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '50px 0', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📍</div>
            Nenhuma solicitação para rastrear.
          </div>
        )}

        {ativas.length > 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 2 }}>Em andamento</div>
            {ativas.map(s => {
              const b = BADGE[s.status] || { bg: '#eee', color: '#666', label: s.status };
              return (
                <div key={s.id} onClick={() => navigate(`/acompanhamento/${s.id}`)}
                  style={{ background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', padding: 14, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#222', flex: 1, paddingRight: 8 }}>{s.endereco}</div>
                    <span style={{ background: b.bg, color: b.color, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>{b.label}</span>
                  </div>
                  <ProgressBar status={s.status} />
                  <div style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>
                    {new Date(s.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    {' · '}toque para ver detalhes
                  </div>
                </div>
              );
            })}
          </>
        )}

        {finalizadas.length > 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginTop: 8, marginBottom: 2 }}>Finalizadas</div>
            {finalizadas.map(s => {
              const b = BADGE[s.status] || { bg: '#eee', color: '#666', label: s.status };
              return (
                <div key={s.id} onClick={() => navigate(`/acompanhamento/${s.id}`)}
                  style={{ background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', padding: 14, cursor: 'pointer', opacity: 0.7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#222', flex: 1, paddingRight: 8 }}>{s.endereco}</div>
                    <span style={{ background: b.bg, color: b.color, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>{b.label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
                    {new Date(s.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <BottomNav active="rastrear" />
    </div>
  );
}
