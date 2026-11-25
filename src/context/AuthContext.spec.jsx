import { fireEvent, render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

function ControlesSesion() {
  const { user, guardarSesion, logout } = useAuth();

  return (
    <>
      <button onClick={() => guardarSesion({
        id: 7,
        nombre: 'Ana',
        rol: 'cliente',
        token: 'jwt-de-prueba',
      })}>
        Iniciar
      </button>
      <button onClick={logout}>Cerrar</button>
      <span>{user?.nombre}</span>
    </>
  );
}

describe('AuthContext', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('guarda el JWT aparte del perfil y lo elimina al cerrar sesión', () => {
    render(
      <AuthProvider>
        <ControlesSesion />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar' }));

    expect(localStorage.getItem('token')).toBe('jwt-de-prueba');
    expect(JSON.parse(localStorage.getItem('poke_sesion'))).toEqual({
      id: 7,
      nombre: 'Ana',
      rol: 'cliente',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('poke_sesion')).toBeNull();
  });

  it('identifica una sesión de vendedor', () => {
    localStorage.setItem('poke_sesion', JSON.stringify({ id: 9, rol: 'vendedor' }));

    function RolActual() {
      return <span>{useAuth().esVendedor ? 'vendedor' : 'otro'}</span>;
    }

    render(
      <AuthProvider>
        <RolActual />
      </AuthProvider>
    );

    expect(screen.getByText('vendedor')).toBeTruthy();
  });
});
