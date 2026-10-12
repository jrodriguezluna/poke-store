import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Catalogo from './Catalogo';
import { PRODUCTOS_MOCK } from '../data/productos';

describe('Catalogo Component', () => {
  it('renderiza producto', () => {
    console.log('[LOG][Catalogo] Inicio');
    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    // detalles
    const tarjetas = screen.getAllByRole('link', { name: /ver detalle/i });
    expect(tarjetas.length).toBe(PRODUCTOS_MOCK.length);

    // nombres
    PRODUCTOS_MOCK.forEach((producto) => {
      expect(screen.getByText(producto.nombre)).toBeTruthy();
    });

    console.log('[LOG][Catalogo] OK: ' + tarjetas.length + ' tarjetas renderizadas');
  });

  it('filtra los productos', () => {
    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    // testeo
    expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    expect(screen.getByText('Figura Coleccionable Charizard')).toBeTruthy();


    const inputBusqueda = screen.getByPlaceholderText('Ej: Pikachu, Peluche...');
    fireEvent.change(inputBusqueda, { target: { value: 'Pikachu' } });

    expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    expect(screen.queryByText('Figura Coleccionable Charizard')).toBeNull();
  });
});
