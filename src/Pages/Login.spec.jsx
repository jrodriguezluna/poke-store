import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from './Login';

describe('Vista Login', () => {
  it('muestra error con email inválido', () => {
    console.log('[LOG][Login] Inicio: validación de email');

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(screen.getByText(/email inválido/i)).toBeTruthy();
    console.log('[LOG][Login] OK: error mostrado');
  });
});