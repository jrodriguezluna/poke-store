import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Registro from './Pages/Registro';
import Home from './Pages/Home';
import Catalogo from './Pages/Catalogo';
import Nosotros from './Pages/Nosotros';
import Detalle from './Pages/Detalle';
import Carrito from './Pages/Carrito';
import Contacto from './Pages/Contacto';
import Perfil from './Pages/Perfil';
import Login from './Pages/Login';
import Blogs from './Pages/Blogs';
import Ordenes from './Pages/Ordenes';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductosProvider } from './context/ProductosContext';

function AppRoutes() {
  const { esVendedor } = useAuth();

  if (esVendedor) {
    return (
      <Routes>
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<Detalle />} />
        <Route path="/ordenes" element={<Ordenes />} />
        <Route path="*" element={<Navigate to="/catalogo" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/producto/:id" element={<Detalle />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

function AppLayout() {
  const { esAdmin } = useAuth();

  return <AppLayoutContent key={esAdmin ? 'admin' : 'not-admin'} esAdmin={esAdmin} />;
}

function AppLayoutContent({ esAdmin }) {
  const [adminPanelAbierto, setAdminPanelAbierto] = useState(false);
  const [anchoAdminPanel, setAnchoAdminPanel] = useState(480);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar onAdminToggle={() => setAdminPanelAbierto((abierto) => !abierto)} />
      <div className="app-content">
        <AdminPanel
          abierto={esAdmin && adminPanelAbierto}
          onCerrar={() => setAdminPanelAbierto(false)}
          ancho={anchoAdminPanel}
          onCambiarAncho={setAnchoAdminPanel}
        />
        <div className="app-page">
          <main className="flex-grow-1 py-4 py-md-5">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
    <ProductosProvider>
      <AppLayout />
    </ProductosProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;