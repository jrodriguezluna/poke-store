import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Checkout from './Checkout';

describe('Checkout Component', () => {
  it('permite completar el formulario de despacho y procesar la orden exitosamente', () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    // 1. Verificamos que el formulario de checkout esté visible
    expect(screen.getByRole('heading', { name: /Finalizar Compra \(Checkout\)/i })).toBeTruthy();

    // 2. Rellenamos los campos del formulario
    const inputNombre = screen.getByLabelText(/Nombre Completo:/i);
    const inputEmail = screen.getByLabelText(/Correo Electrónico:/i);
    const inputDireccion = screen.getByLabelText(/Dirección de Entrega:/i);

    fireEvent.change(inputNombre, { target: { value: 'Ash Ketchum' } });
    fireEvent.change(inputEmail, { target: { value: 'ash@pueblopaleta.cl' } });
    fireEvent.change(inputDireccion, { target: { value: 'Calle Principal 123' } });

    // 3. Enviamos el formulario haciendo clic en el botón de confirmar y pagar
    const btnConfirmar = screen.getByRole('button', { name: /Confirmar y Pagar/i });
    fireEvent.click(btnConfirmar);

    // 4. Verificamos que la pantalla de orden completada se muestre con los datos ingresados
    expect(screen.getByRole('heading', { name: /¡Gracias por tu compra!/i })).toBeTruthy();
    expect(screen.getByText('Ash Ketchum')).toBeTruthy();
    expect(screen.getByText('Calle Principal 123')).toBeTruthy();
  });
});

