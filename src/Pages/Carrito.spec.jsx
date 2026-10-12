import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { PRODUCTOS_MOCK } from '../data/productos';
import Carrito from './Carrito';

const SESION_KEY = 'poke_sesion';
const CARRITO_KEY = 'poke_carrito';

// Usuario de prueba que simula una sesión activa
const usuarioMock = {
  id: 1,
  nombre: 'Ash Ketchum',
  email: 'ash@pokestore.cl',
  rol: 'cliente',
};

describe('Carrito Component', () => {
  beforeEach(() => {
    // Simulamos que hay un usuario logueado en localStorage
    localStorage.setItem(SESION_KEY, JSON.stringify(usuarioMock));
    localStorage.setItem(CARRITO_KEY, JSON.stringify([
      { ...PRODUCTOS_MOCK[0], cantidad: 2 },
      { ...PRODUCTOS_MOCK[1], cantidad: 1 },
    ]));

    // Mockeamos fetch para que POST /api/pedidos responda con éxito
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(
        new Response(JSON.stringify({ id: 4215, total: 61970 }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
  });

  afterEach(() => {
    localStorage.removeItem(SESION_KEY);
    localStorage.removeItem(CARRITO_KEY);
  });

  it('permite pagar con la API y muestra el número de orden real', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Carrito />
        </AuthProvider>
      </MemoryRouter>
    );

    // 1. Verificamos que los productos de prueba estén en pantalla
    expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    expect(screen.getByText('Figura Coleccionable Charizard')).toBeTruthy();

    // 2. Hacemos clic en 'PAGAR RÁPIDO'
    const btnPagar = screen.getByRole('button', { name: /PAGAR RÁPIDO/i });
    fireEvent.click(btnPagar);

    // 3. Esperamos la respuesta asíncrona de la API
    await waitFor(() => {
      expect(screen.getByText(/¡Compra Realizada con Éxito!/i)).toBeTruthy();
    });

    // 4. Verificamos que muestre el número de orden que devolvió el backend (4215)
    expect(screen.getByText(/#PK-4215/i)).toBeTruthy();
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem(CARRITO_KEY))).toEqual([]);
    });
  });
});
