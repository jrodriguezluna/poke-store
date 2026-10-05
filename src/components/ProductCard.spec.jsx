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
});
