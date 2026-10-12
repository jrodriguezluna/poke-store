import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PRODUCTOS_MOCK } from '../data/productos';
import Catalogo from './Catalogo';

describe('Catalogo Component', () => {
  beforeEach(() => {
    // Mockeamos window.fetch para que la API devuelva los datos mock
    // de forma inmediata, sin necesitar un backend real corriendo
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(
        new Response(JSON.stringify(PRODUCTOS_MOCK), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
  });

  it('renderiza los productos recibidos desde la API', async () => {
    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    });

    expect(screen.getByText('Figura Coleccionable Charizard')).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /ver detalle/i }).length)
      .toBe(PRODUCTOS_MOCK.length);
    PRODUCTOS_MOCK.forEach((producto) => {
      expect(screen.getByText(producto.nombre)).toBeTruthy();
    });
  });

  it('filtra los productos por nombre al escribir en el campo de búsqueda', async () => {
    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    });

    const inputBusqueda = screen.getByPlaceholderText('Ej: Pikachu, Peluche...');
    fireEvent.change(inputBusqueda, { target: { value: 'Pikachu' } });

    expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    expect(screen.queryByText('Figura Coleccionable Charizard')).toBeNull();
  });

  it('filtra productos por categoría', async () => {
    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Peluches' }));

    expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    expect(screen.queryByText('Figura Coleccionable Charizard')).toBeNull();
  });
});
