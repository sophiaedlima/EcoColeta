import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const S = {
  wrap: { background: '#2a3e2e', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  hero: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 },
  ico: { width: 64, height: 64, borderRadius: 18, background: 'rgba(92,201,122,0.2)', border: '1px solid rgba(92,201,122,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 },
  brand: { fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 600, color: '#fff', letterSpacing: -1 },
  tag: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  card: { background: '#f5f5f0', borderRadius: '22px 22px 0 0', padding: '28px 24px 44px', display: 'flex', flexDirection: 'column', gap: 14 },
  cardTitle: { fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 600, color: '#1a1a1a' },
  label: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#888', display: 'block', marginBottom: 5 },
  input: { width: '100%', height: 42, borderRadius: 8, border: '1.5px solid #ccc', background: '#fff', padding: '0 14px', fontSize: 13, color: '#333', outline: 'none', fontFamily: 'DM Sans, sans-serif' },
  btn: { height: 46, borderRadius: 10, background: '#3a5a42', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' },
  btnDis: { opacity: 0.6, cursor: 'not-allowed' },
  foot: { textAlign: 'center', fontSize: 12, color: '#aaa' },
  link: { color: '#3a5a42', fontWeight: 600, cursor: 'pointer' },
};

export default function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  if (usuario) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const role = await login(email, senha);
      navigate(role === 'ADMIN' ? '/admin' : '/');
    } catch {
      setErro('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.wrap}>
      <div style={S.hero}>
        <div style={S.ico}>♻️</div>
        <div style={S.brand}>Eco<span style={{ color: '#5cc97a' }}>Coleta</span></div>
        <div style={S.tag}>Recicle com facilidade</div>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Entrar na conta</div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={S.label}>E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com" style={S.input} />
          </div>
          <div>
            <label style={S.label}>Senha</label>
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required placeholder="••••••••" style={S.input} />
          </div>
          {erro && <p style={{ color: '#e53e3e', fontSize: 13 }}>{erro}</p>}
          <button type="submit" disabled={loading} style={{ ...S.btn, ...(loading ? S.btnDis : {}) }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div style={S.foot}>
          Não tem conta? <span style={S.link}>Cadastrar</span>
        </div>
      </div>
    </div>
  );
}
