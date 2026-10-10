import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Registro from './Pages/Registro';
import Home from './Pages/Home';
import Catalogo from './Pages/Catalogo';
import Nosotros from './Pages/Nosotros';
import Detalle from './Pages/Detalle';
import Carrito from './Pages/Carrito';
import Checkout from './Pages/Checkout';
import Contacto from './Pages/Contacto';
import Perfil from './Pages/Perfil';
import Login from './Pages/Login';
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
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;