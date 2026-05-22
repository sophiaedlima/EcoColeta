import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import NovaSolicitacao from './pages/NovaSolicitacao';
import Acompanhamento from './pages/Acompanhamento';
import Rastrear from './pages/Rastrear';
import Perfil from './pages/Perfil';
import PainelAdmin from './pages/admin/PainelAdmin';

function RotaProtegida({ children, apenasAdmin = false }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (apenasAdmin && usuario.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RotaProtegida><Home /></RotaProtegida>} />
          <Route path="/nova" element={<RotaProtegida><NovaSolicitacao /></RotaProtegida>} />
          <Route path="/acompanhamento/:id" element={<RotaProtegida><Acompanhamento /></RotaProtegida>} />
          <Route path="/rastrear" element={<RotaProtegida><Rastrear /></RotaProtegida>} />
          <Route path="/perfil" element={<RotaProtegida><Perfil /></RotaProtegida>} />
          <Route path="/admin" element={<RotaProtegida apenasAdmin><PainelAdmin /></RotaProtegida>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
