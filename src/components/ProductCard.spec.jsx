import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('muestra el nombre del producto', () => {
    render(<ProductCard nombre="Polera" precio={9990} onAdd={() => {}} />);
    expect(screen.getByText('Polera')).toBeTruthy();
  });

  it('llama a onAdd al hacer clic en Agregar', () => {
    const onAdd = jasmine.createSpy('onAdd');
    render(<ProductCard nombre="Polera" precio={9990} onAdd={onAdd} />);
    fireEvent.click(screen.getByText('Agregar'));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('avisa cuando quedan cinco unidades o menos, pero no con seis', () => {
    const { rerender } = render(
      <ProductCard producto={{ nombre: 'Polera', stock: 5 }} />
    );
    expect(screen.getByRole('status').textContent).toBe('¡Pocas unidades!');

    rerender(<ProductCard producto={{ nombre: 'Polera', stock: 6 }} />);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('muestra agotado cuando no quedan unidades', () => {
    render(<ProductCard producto={{ nombre: 'Polera', stock: 0 }} />);
    expect(screen.getByRole('status').textContent).toBe('Agotado');
  });
});
