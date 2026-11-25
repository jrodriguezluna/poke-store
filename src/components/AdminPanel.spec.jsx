import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProductosProvider } from '../context/ProductosContext';
import AdminPanel, { AdminPanelToggle } from './AdminPanel';

const respuesta = (data) =>
  Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(data) });

function AdminPanelDemo() {
  const [abierto, setAbierto] = useState(false);
  const [ancho, setAncho] = useState(480);

  return (
    <>
      <AdminPanelToggle onClick={() => setAbierto((actual) => !actual)} />
      <div className="app-content">
        <AdminPanel
          abierto={abierto}
          onCerrar={() => setAbierto(false)}
          ancho={ancho}
          onCambiarAncho={setAncho}
        />
        <div className="app-page">
          <main>Contenido de la página</main>
        </div>
      </div>
    </>
  );
}

const renderConRol = (rol) => {
  if (rol) localStorage.setItem('poke_sesion', JSON.stringify({ id: 1, nombre: 'Test', rol }));
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ProductosProvider>
          <AdminPanelDemo />
        </ProductosProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Panel lateral de administración', () => {
  beforeEach(() => {
    spyOn(window, 'fetch').and.callFake((url) => {
      if (String(url).includes('/api/usuarios')) {
        return respuesta([{ id: 7, nombre: 'Brock', email: 'brock@pokestore.cl', rol: 'cliente' }]);
      }
      if (String(url).includes('/api/blogs')) {
        return respuesta([{
          id: 3,
          etiqueta: 'Guía',
          titulo: 'Cuidar una colección',
          resumen: 'Resumen',
          autor: 'Entrenador',
          imagen: null,
          textoAlternativo: null,
          introduccion: 'Introducción',
          secciones: [{ id: 1, orden: 0, titulo: 'Guardar', texto: 'Texto' }],
          consejo: null,
        }]);
      }
      return respuesta([{ id: 1, nombre: 'Pikachu Peluche', categoria: 'Peluches', precio: 15000, stock: 5 }]);
    });
  });

  afterEach(() => localStorage.clear());

  it('no aparece si no hay sesión', () => {
    console.log('[LOG][AdminPanel] Inicio: sin sesión');
    renderConRol(null);

    expect(screen.queryByRole('button', { name: /panel de administración/i })).toBeNull();
    console.log('[LOG][AdminPanel] OK: oculto');
  });

  it('no aparece para un cliente', () => {
    console.log('[LOG][AdminPanel] Inicio: cliente');
    renderConRol('cliente');

    expect(screen.queryByRole('button', { name: /panel de administración/i })).toBeNull();
    console.log('[LOG][AdminPanel] OK: oculto');
  });

  it('muestra el botón ☰ al admin y permite abrir las secciones del panel', async () => {
    console.log('[LOG][AdminPanel] Inicio: admin abre el panel');
    renderConRol('admin');

    expect(screen.queryByText('Administración')).toBeNull(); // cerrado al inicio
    fireEvent.click(screen.getByRole('button', { name: /panel de administración/i }));

    expect(await screen.findByText('Administración')).toBeTruthy();
    expect(screen.getByRole('main').parentElement.previousElementSibling.querySelector('.admin-panel'))
      .toBeTruthy();
    const tabProductos = screen.getByRole('tab', { name: 'Productos' });
    expect(screen.getByRole('button', { name: /agregar producto/i }).parentElement)
      .toBe(tabProductos.closest('.admin-panel-tabs'));
    expect(await screen.findByText('Pikachu Peluche')).toBeTruthy();

    fireEvent.click(screen.getByRole('tab', { name: 'Usuarios' }));
    expect(await screen.findByText('brock@pokestore.cl')).toBeTruthy();

    fireEvent.click(screen.getByRole('tab', { name: 'Blogs' }));
    expect(await screen.findByText('Cuidar una colección')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar panel de administración' }));
    expect(screen.queryByText('Administración')).toBeNull();
    console.log('[LOG][AdminPanel] OK: panel con ambas secciones');
  });

  it('permite cambiar el ancho del panel con el teclado', () => {
    renderConRol('admin');
    fireEvent.click(screen.getByRole('button', { name: /panel de administración/i }));

    const control = screen.getByRole('separator', { name: 'Redimensionar panel de administración' });
    expect(control.getAttribute('aria-valuenow')).toBe('480');
    fireEvent.keyDown(control, { key: 'ArrowRight' });
    expect(control.getAttribute('aria-valuenow')).toBe('496');
  });
});
