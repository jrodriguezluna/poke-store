import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProductosProvider } from '../context/ProductosContext';
import AdminPanel from './AdminPanel';

const respuesta = (data) =>
  Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(data) });

const renderConRol = (rol) => {
  if (rol) localStorage.setItem('poke_sesion', JSON.stringify({ id: 1, nombre: 'Test', rol }));
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ProductosProvider>
          <AdminPanel />
        </ProductosProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Panel lateral de administración', () => {
  beforeEach(() => {
    spyOn(window, 'fetch').and.callFake((url) =>
      respuesta(String(url).includes('/api/usuarios')
        ? [{ id: 7, nombre: 'Brock', email: 'brock@pokestore.cl', rol: 'cliente' }]
        : [{ id: 1, nombre: 'Pikachu Peluche', categoria: 'Peluches', precio: 15000, stock: 5 }])
    );
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

  it('muestra el botón ☰ al admin y abre el panel con Productos y Usuarios', async () => {
    console.log('[LOG][AdminPanel] Inicio: admin abre el panel');
    renderConRol('admin');

    expect(screen.queryByText('Administración')).toBeNull(); // cerrado al inicio
    fireEvent.click(screen.getByRole('button', { name: /panel de administración/i }));

    expect(await screen.findByText('Administración')).toBeTruthy();
    expect(await screen.findByText('Pikachu Peluche')).toBeTruthy();

    fireEvent.click(screen.getByRole('tab', { name: 'Usuarios' }));
    expect(await screen.findByText('brock@pokestore.cl')).toBeTruthy();
    console.log('[LOG][AdminPanel] OK: panel con ambas secciones');
  });
});
