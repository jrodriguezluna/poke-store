import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Detalle from './Detalle';

describe('Detalle Component', () => {
  it('muestra la información del producto según la URL y permite agregar al carrito', () => {
    // Renderizamos Detalle simulando la ruta /producto/1 (Peluche Pikachu)
    render(
      <MemoryRouter initialEntries={['/producto/1']}>
        <Routes>
          <Route path="/producto/:id" element={<Detalle />} />
        </Routes>
      </MemoryRouter>
    );

    // 1. Verificamos que se muestren los datos del producto ID 1
    expect(screen.getByRole('heading', { name: 'Peluche Pikachu 30cm' })).toBeTruthy();
    expect(screen.getByText(/Código:\s*PK-001/)).toBeTruthy();

    // 2. Simulamos clic en el botón '+' para aumentar la cantidad
    const btnSumar = screen.getByText('+');
    fireEvent.click(btnSumar);

    // 3. Simulamos clic en 'Añadir al carrito'
    const btnAgregar = screen.getByRole('button', { name: /Añadir al carrito/i });
    fireEvent.click(btnAgregar);

    // 4. Verificamos que aparezca la alerta de éxito con las 2 unidades seleccionadas
    expect(
      screen.getByText(/¡Producto añadido al carrito con éxito!\s*\(2 unidades\)/)
    ).toBeTruthy();
  });
});

