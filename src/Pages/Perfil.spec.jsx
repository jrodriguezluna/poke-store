import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Perfil from './Perfil';

describe('Vista Perfil', () => {
  it('muestra los datos del usuario', () => {
    console.log('[LOG][Perfil] Inicio: datos del usuario desde localStorage');

    const sesion = {
      nombre: 'Ash Ketchum',
      email: 'ash@pokestore.cl',
      direccion: 'Calle Falsa 123',
      region: 'Región Metropolitana',
      comuna: 'Providencia',
    };
    spyOn(Storage.prototype, 'getItem').and.callFake((clave) =>
      clave === 'poke_sesion' ? JSON.stringify(sesion) : null
    );

    render(
      <MemoryRouter>
        <AuthProvider>
          <Perfil />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('ash@pokestore.cl')).toBeTruthy();
    expect(screen.getByText('Providencia')).toBeTruthy();
    console.log('[LOG][Perfil] OK: datos mostrados');
  });
});