import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Ordenes from './Ordenes';

describe('Vista de órdenes para vendedor', () => {
  beforeEach(() => {
    localStorage.setItem('poke_sesion', JSON.stringify({ id: 9, rol: 'vendedor' }));
    spyOn(window, 'fetch').and.callFake((url) => {
      const datos = String(url).endsWith('/api/pedidos/21')
        ? {
            id: 21,
            total: 3000,
            fecha: '2026-01-02T10:30:00',
            items: [{ nombre: 'Pikachu', cantidad: 2, precioUnit: 1500 }],
          }
        : [{
            id: 21,
            total: 3000,
            fecha: '2026-01-02T10:30:00',
            items: [],
          }];
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(datos),
      });
    });
  });

  afterEach(() => localStorage.clear());

  it('lista todas las órdenes y carga el detalle seleccionado', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Ordenes />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('Orden #PK-21')).toBeTruthy();
    expect(window.fetch.calls.argsFor(0)[0]).toMatch(/\/api\/pedidos$/);

    fireEvent.click(screen.getByRole('button', { name: 'Ver detalle orden 21' }));

    expect(await screen.findByText('Detalle de orden #PK-21')).toBeTruthy();
    expect(screen.getByText('Pikachu × 2')).toBeTruthy();
    expect(screen.getByText(/Precio unitario:/)).toBeTruthy();
  });
});
