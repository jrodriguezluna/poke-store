import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useAuth } from '../context/AuthContext';
import PanelProductos from './admin/PanelProductos';
import PanelUsuarios from './admin/PanelUsuarios';

const SECCIONES = [
  { id: 'productos', etiqueta: 'Productos' },
  { id: 'usuarios', etiqueta: 'Usuarios' },
];

// Botón ☰ + panel lateral de administración.
// Solo existe cuando la sesión es de un admin; para cualquier otro usuario no renderiza nada.
export default function AdminPanel() {
  const { esAdmin } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const [seccion, setSeccion] = useState('productos');

  if (!esAdmin) return null;

  return (
    <>
      <Button
        variant="outline-light"
        size="sm"
        className="d-inline-flex align-items-center gap-2 me-3"
        aria-label="Abrir panel de administración"
        onClick={() => setAbierto(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="d-none d-sm-inline">Admin</span>
      </Button>

      {/* Sin fondo oscuro y con scroll: la página sigue visible y se ve el cambio al guardar */}
      <Offcanvas
        show={abierto}
        onHide={() => setAbierto(false)}
        backdrop={false}
        scroll
        enforceFocus={false}
        style={{ width: 'min(420px, 100vw)' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Administración</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          {/* Marcado Bootstrap plano: <Nav> de react-bootstrap heredaría el estilo del Navbar */}
          <div className="nav nav-pills mb-3" role="tablist">
            {SECCIONES.map(({ id, etiqueta }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={seccion === id}
                className={`nav-link ${seccion === id ? 'active' : ''}`}
                onClick={() => setSeccion(id)}
              >
                {etiqueta}
              </button>
            ))}
          </div>

          {seccion === 'productos' ? <PanelProductos /> : <PanelUsuarios />}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
