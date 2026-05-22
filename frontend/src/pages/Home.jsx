import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { solicitacoesService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

const BADGE = {
  PENDENTE:          { bg: '#fef3dc', color: '#7a5010', label: 'Pendente' },
  AGENDADO:          { bg: '#ddeeff', color: '#1a4ab0', label: 'Agendado' },
  COLETOR_A_CAMINHO: { bg: '#ffe8cc', color: '#7a3a00', label: 'Coletor a caminho' },
  EM_COLETA:         { bg: '#ffe8cc', color: '#7a3a00', label: 'Em coleta' },
  CONCLUIDO:         { bg: '#d8f0de', color: '#1a4a2a', label: 'Concluído' },
  CANCELADO:         { bg: '#ffe0e0', color: '#7a0000', label: 'Cancelado' },
};

export default function Home() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    function carregar() {
      solicitacoesService.listar().then(({ data }) => setSolicitacoes(data)).catch(() => {});
    }
    carregar();
    window.addEventListener('focus', carregar);
    return () => window.removeEventListener('focus', carregar);
  }, []);

  const nome = usuario?.email?.split('@')[0] || 'Usuário';

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#3a5a42', padding: '16px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Olá,</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 600, color: '#fff' }}>{nome}</div>
          </div>
          <button onClick={logout} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, color: 'rgba(255,255,255,0.7)', padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
            Sair
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', paddingBottom: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>Minhas solicitações</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {usuario?.role === 'ADMIN' && (
              <button onClick={() => navigate('/admin')} style={{ background: '#1a2e1e', color: '#fff', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                Admin
              </button>
            )}
            <button onClick={() => navigate('/nova')} style={{ background: '#3a5a42', color: '#fff', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              + Nova
            </button>
          </div>
        </div>

        {solicitacoes.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '50px 0', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>♻️</div>
            Nenhuma solicitação ainda.<br />
            <span style={{ color: '#3a5a42', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/nova')}>Criar primeira solicitação</span>
          </div>
        ) : (
          solicitacoes.map(s => {
            const b = BADGE[s.status] || { bg: '#eee', color: '#666', label: s.status };
            return (
              <div key={s.id} onClick={() => navigate(`/acompanhamento/${s.id}`)}
                style={{ background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', padding: 14, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>{s.endereco}</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                      {new Date(s.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <span style={{ background: b.bg, color: b.color, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {b.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
}
