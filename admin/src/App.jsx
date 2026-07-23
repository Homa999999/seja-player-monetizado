import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EditorHero from './pages/EditorHero';
import EditorCourse from './pages/EditorCourse';
import EditorModules from './pages/EditorModules';
import EditorInstructor from './pages/EditorInstructor';
import EditorTestimonials from './pages/EditorTestimonials';
import EditorOffer from './pages/EditorOffer';
import EditorButtons from './pages/EditorButtons';
import EditorSettings from './pages/EditorSettings';
import History from './pages/History';
import AdminLayout from './components/AdminLayout';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="hero" element={<EditorHero />} />
        <Route path="curso" element={<EditorCourse />} />
        <Route path="modulos" element={<EditorModules />} />
        <Route path="professor" element={<EditorInstructor />} />
        <Route path="depoimentos" element={<EditorTestimonials />} />
        <Route path="oferta" element={<EditorOffer />} />
        <Route path="botoes" element={<EditorButtons />} />
        <Route path="configuracoes" element={<EditorSettings />} />
        <Route path="historico" element={<History />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
