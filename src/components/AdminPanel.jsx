import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import { useAuth } from '../context/AuthContext';
import PanelProductos from './admin/PanelProductos';
import PanelUsuarios from './admin/PanelUsuarios';
import PanelBlogs from './admin/PanelBlogs';

const ANCHO_MINIMO = 280;
const ANCHO_MAXIMO = 760;

const limitarAncho = (ancho) =>
  Math.max(ANCHO_MINIMO, Math.min(ancho, Math.min(ANCHO_MAXIMO, window.innerWidth * 0.7)));

// El acceso al panel solo aparece para una sesión de administrador.
export function AdminPanelToggle({ onClick }) {
  const { esAdmin } = useAuth();
  if (!esAdmin) return null;

  return (
    <Button
      variant="outline-light"
      size="sm"
      className="d-inline-flex align-items-center gap-2 me-3"
      aria-label="Abrir panel de administración"
      onClick={onClick}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <span className="d-none d-sm-inline">Admin</span>
    </Button>
  );
}

export default function AdminPanel({ abierto, onCerrar, ancho, onCambiarAncho }) {
  const [seccion, setSeccion] = useState('productos');

  if (!abierto) return null;

  return (
    <div className="admin-panel-slot" style={{ '--admin-panel-width': `${ancho}px` }}>
      <aside className="admin-panel" aria-label="Panel de administración">
        <div className="admin-panel-header">
          <h2 className="h5 mb-0">Administración</h2>
          <CloseButton aria-label="Cerrar panel de administración" onClick={onCerrar} />
        </div>
        <div className="admin-panel-section">
          {seccion === 'productos' ? (
            <PanelProductos
              seccionActiva={seccion}
              onCambiarSeccion={setSeccion}
            />
          ) : seccion === 'usuarios' ? (
            <PanelUsuarios
              seccionActiva={seccion}
              onCambiarSeccion={setSeccion}
            />
          ) : (
            <PanelBlogs
              seccionActiva={seccion}
              onCambiarSeccion={setSeccion}
            />
          )}
        </div>
        <div
          className="admin-panel-resize-handle"
          role="separator"
          aria-label="Redimensionar panel de administración"
          aria-orientation="vertical"
          aria-valuemin={ANCHO_MINIMO}
          aria-valuemax={Math.min(ANCHO_MAXIMO, Math.round(window.innerWidth * 0.7))}
          aria-valuenow={ancho}
          tabIndex={0}
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              onCambiarAncho(limitarAncho(event.clientX));
            }
          }}
          onKeyDown={(event) => {
            const ajuste = event.key === 'ArrowRight' ? 16 : event.key === 'ArrowLeft' ? -16 : 0;
            if (ajuste) {
              event.preventDefault();
              onCambiarAncho(limitarAncho(ancho + ajuste));
            } else if (event.key === 'Home') {
              event.preventDefault();
              onCambiarAncho(ANCHO_MINIMO);
            } else if (event.key === 'End') {
              event.preventDefault();
              onCambiarAncho(limitarAncho(ANCHO_MAXIMO));
            }
          }}
        />
      </aside>
    </div>
  );
}
