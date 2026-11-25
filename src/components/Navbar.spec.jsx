import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Navbar from './Navbar';

describe('Navegación del vendedor', () => {
  beforeEach(() => {
    localStorage.setItem('poke_sesion', JSON.stringify({ id: 9, rol: 'vendedor' }));
  });

  afterEach(() => localStorage.clear());

  it('muestra solo catálogo, órdenes y cierre de sesión', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Catálogo' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Órdenes' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Salir' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Carrito' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Perfil' })).toBeNull();
    expect(screen.queryByRole('button', { name: /panel de administración/i })).toBeNull();
  });
});
