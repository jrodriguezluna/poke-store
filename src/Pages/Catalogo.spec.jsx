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

  it('filtra los productos por nombre al escribir en el campo de búsqueda', async () => {
    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    // Esperamos a que el fetch resuelva y los productos aparezcan en pantalla
    await waitFor(() => {
      expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    });

    // Verificamos que Charizard también esté visible al inicio
    expect(screen.getByText('Figura Coleccionable Charizard')).toBeTruthy();

    // Escribimos "Pikachu" en el buscador
    const inputBusqueda = screen.getByPlaceholderText('Ej: Pikachu, Peluche...');
    fireEvent.change(inputBusqueda, { target: { value: 'Pikachu' } });

    // Verificamos que solo quede Pikachu visible
    expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    expect(screen.queryByText('Figura Coleccionable Charizard')).toBeNull();
  });
});
