import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { solicitacoesService } from '../services/api';
import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, concluidas: 0, pendentes: 0 });

  useEffect(() => {
    solicitacoesService.listar().then(({ data }) => {
      setStats({
        total: data.length,
        concluidas: data.filter(s => s.status === 'CONCLUIDO').length,
        pendentes: data.filter(s => s.status === 'PENDENTE').length,
      });
    }).catch(() => {});
  }, []);

  const nome = usuario?.email?.split('@')[0] || 'Usuário';
  const inicial = nome[0]?.toUpperCase() || 'U';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#3a5a42', padding: '24px 16px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#5cc97a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: '#fff' }}>
            {inicial}
          </div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 600, color: '#fff' }}>{nome}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{usuario?.email}</div>
          {usuario?.role === 'ADMIN' && (
            <span style={{ background: 'rgba(92,201,122,0.25)', color: '#5cc97a', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Admin</span>
          )}
        </div>
      </div>

      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 80 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Total', value: stats.total },
            { label: 'Concluídas', value: stats.concluidas },
            { label: 'Pendentes', value: stats.pendentes },
          ].map(item => (
            <div key={item.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 600, color: '#1a4a2a' }}>{item.value}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Opções */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          {usuario?.role === 'ADMIN' && (
            <button onClick={() => navigate('/admin')}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'none', border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 18 }}>⚙️</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>Painel Admin</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>Gerenciar solicitações e agendamentos</div>
              </div>
            </button>
          )}
          <button onClick={() => navigate('/')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'none', border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ fontSize: 18 }}>♻️</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>Minhas solicitações</div>
              <div style={{ fontSize: 11, color: '#aaa' }}>Ver histórico de coletas</div>
            </div>
          </button>
          <button onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ fontSize: 18 }}>🚪</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#c0392b' }}>Sair da conta</div>
              <div style={{ fontSize: 11, color: '#aaa' }}>Desconectar do EcoColeta</div>
            </div>
          </button>
        </div>
      </div>

      <BottomNav active="perfil" />
    </div>
  );
}
