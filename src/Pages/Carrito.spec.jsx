import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Carrito from './Carrito';

describe('Carrito Component', () => {
  it('permite vaciar el carrito y procesar la compra simulada', () => {
    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    // 1. Verificamos que inicialmente se muestren los productos de prueba (Pikachu y Charizard)
    expect(screen.getByText('Peluche Pikachu 30cm')).toBeTruthy();
    expect(screen.getByText('Figura Coleccionable Charizard')).toBeTruthy();

    // 2. Hacemos clic en el botón 'PAGAR'
    const btnPagar = screen.getByRole('button', { name: /PAGAR/i });
    fireEvent.click(btnPagar);

    // 3. Verificamos que aparezca el modal de compra exitosa
    expect(screen.getByText(/¡Compra Realizada con Éxito!/i)).toBeTruthy();
    expect(screen.getByText(/¡Gracias por tu compra en PokeStore!/i)).toBeTruthy();
  });
});

