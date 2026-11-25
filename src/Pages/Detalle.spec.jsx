import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProductosProvider } from '../context/ProductosContext';
import Detalle from './Detalle';

describe('Detalle Component', () => {
  beforeEach(() => {
    localStorage.removeItem('poke_carrito');
    localStorage.removeItem('poke_sesion');
  });

  afterEach(() => {
    localStorage.removeItem('poke_carrito');
    localStorage.removeItem('poke_sesion');
  });

  it('muestra la información del producto según la URL y permite agregar al carrito', () => {
    // Renderizamos Detalle simulando la ruta /producto/1 (Peluche Pikachu)
    render(
      <MemoryRouter initialEntries={['/producto/1']}>
        <Routes>
          <Route path="/producto/:id" element={<AuthProvider><ProductosProvider><Detalle /></ProductosProvider></AuthProvider>} />
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
    const carritoGuardado = JSON.parse(localStorage.getItem('poke_carrito'));
    expect(carritoGuardado[0].id).toBe(1);
    expect(carritoGuardado[0].cantidad).toBe(2);
  });

  it('destaca el poco stock en el detalle del producto', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, nombre: 'Peluche Pikachu 30cm', precio: 15990, stock: 5 },
        ]),
      })
    );

    render(
      <MemoryRouter initialEntries={['/producto/1']}>
        <Routes>
          <Route path="/producto/:id" element={<AuthProvider><ProductosProvider><Detalle /></ProductosProvider></AuthProvider>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('¡Pocas unidades! · En Stock: 5 unidades')).toBeTruthy();
  });

  it('impide añadir al carrito un producto agotado', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, nombre: 'Peluche Pikachu 30cm', precio: 15990, stock: 0 },
        ]),
      })
    );

    render(
      <MemoryRouter initialEntries={['/producto/1']}>
        <Routes>
          <Route path="/producto/:id" element={<AuthProvider><ProductosProvider><Detalle /></ProductosProvider></AuthProvider>} />
        </Routes>
      </MemoryRouter>
    );

    expect((await screen.findByRole('button', { name: 'Agotado' })).disabled).toBe(true);
    expect(screen.getAllByText('Agotado').length).toBe(2);
  });

  it('permite a vendedor ver el producto sin controles de compra', async () => {
    localStorage.setItem('poke_sesion', JSON.stringify({ id: 9, rol: 'vendedor' }));
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, nombre: 'Peluche Pikachu 30cm', precio: 15990, stock: 5 },
        ]),
      })
    );

    render(
      <MemoryRouter initialEntries={['/producto/1']}>
        <Routes>
          <Route path="/producto/:id" element={<AuthProvider><ProductosProvider><Detalle /></ProductosProvider></AuthProvider>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Peluche Pikachu 30cm' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Añadir al carrito/i })).toBeNull();
    expect(screen.queryByLabelText('Cantidad:')).toBeNull();
  });
});

