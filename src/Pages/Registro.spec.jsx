import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Registro from './Registro';

describe('Vista Registro', () => {
  it('detecta contraseñas distintas', () => {
    console.log('[LOG][Registro] Inicio: contraseñas que no coinciden');

    render(
      <MemoryRouter>
        <AuthProvider>
          <Registro />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: '654321' } });
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    expect(screen.getByText(/las contraseñas no coinciden/i)).toBeTruthy();
    console.log('[LOG][Registro] OK: error de contraseñas mostrado');
  });
});