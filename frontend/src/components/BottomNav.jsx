import { useNavigate } from 'react-router-dom';

const ITEMS = [
  {
    key: 'home', label: 'Início', to: '/',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-9.5z" /><path d="M9 21V12h6v9" /></svg>,
  },
  {
    key: 'nova', label: 'Nova', to: '/nova',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>,
  },
  {
    key: 'rastrear', label: 'Rastrear', to: '/rastrear',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  },
  {
    key: 'perfil', label: 'Perfil', to: '/perfil',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>,
  },
];

export default function BottomNav({ active }) {
  const navigate = useNavigate();
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, width: '100%', background: '#fff', borderTop: '1px solid #e8e8e8', display: 'flex', paddingBottom: 18, paddingTop: 8, zIndex: 100 }}>
      {ITEMS.map(item => (
        <button key={item.key} onClick={() => navigate(item.to)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: active === item.key ? '#3a5a42' : '#aaa', fontSize: 10, fontWeight: 500, padding: 0 }}>
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
