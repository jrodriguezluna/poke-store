import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Registro from './Pages/Registro';
import Home from './Pages/Home';
import Catalogo from './Pages/Catalogo';
import Nosotros from './Pages/Nosotros';
import Detalle from './Pages/Detalle';
import Carrito from './Pages/Carrito';
import Contacto from './Pages/Contacto';
import Perfil from './Pages/Perfil';
import Login from './Pages/Login';
import AdminUsuarios from "./Pages/AdminUsuarios";
import AdminProductos from "./Pages/AdminProductos";
import Blogs from './Pages/Blogs';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1 py-4 py-md-5">
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
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/productos" element={<AdminProductos />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;