import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Catalogo from './Catalogo';

describe('Catalogo Component', () => {
  it('filtra los productos por nombre al escribir en el campo de búsqueda', () => {
    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    // Verificamos que inicialmente aparezca Pikachu y Charizard
    expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    expect(screen.getByText('Figura Coleccionable Charizard')).toBeTruthy();

    // Escribimos "Pikachu" en el input de búsqueda
    const inputBusqueda = screen.getByPlaceholderText('Ej: Pikachu, Peluche...');
    fireEvent.change(inputBusqueda, { target: { value: 'Pikachu' } });

    // Verificamos que se muestre Pikachu y no se muestre Charizard
    expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    expect(screen.queryByText('Figura Coleccionable Charizard')).toBeNull();
  });
});

