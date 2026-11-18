import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Perfil from './Perfil';

const montar = (sesion) => {
  spyOn(Storage.prototype, 'getItem').and.callFake((clave) =>
    clave === 'poke_sesion' ? JSON.stringify(sesion) : null
  );
  spyOn(Storage.prototype, 'setItem');
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Perfil />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Vista Perfil', () => {
  it('muestra los datos del usuario', () => {
    console.log('[LOG][Perfil] Inicio: datos del usuario desde localStorage');

    montar({
      nombre: 'Ash Ketchum',
      email: 'ash@pokestore.cl',
      direccion: 'Calle Falsa 123',
      region: 'Región Metropolitana',
      comuna: 'Providencia',
    });

    expect(screen.getByText('ash@pokestore.cl')).toBeTruthy();
    expect(screen.getByText('Providencia')).toBeTruthy();
    expect(screen.getByText('¡Hola, Ash Ketchum!')).toBeTruthy();
    console.log('[LOG][Perfil] OK: datos mostrados');
  });

  it('ofrece "+ Agregar" cuando faltan los datos de despacho', () => {
    console.log('[LOG][Perfil] Inicio: cuenta sin dirección, región ni comuna');

    montar({
      nombre: 'Misty',
      email: 'misty@duoc.cl',
      direccion: 'Sin dirección',
      region: 'Sin región',
      comuna: 'Sin comuna',
    });

    expect(screen.getByText('+ Agregar dirección')).toBeTruthy();
    expect(screen.getByText('+ Agregar región')).toBeTruthy();
    expect(screen.getByText('+ Agregar comuna')).toBeTruthy();
    expect(screen.getByText('Guardar Cambios').disabled).toBe(true);
    console.log('[LOG][Perfil] OK: botones de agregar visibles');
  });

  it('guarda los cambios con PUT y muestra el aviso', async () => {
    console.log('[LOG][Perfil] Inicio: editar teléfono y guardar');

    const sesion = {
      id: 5,
      nombre: 'Brock',
      email: 'brock@duoc.cl',
      direccion: 'Ciudad Plateada 10',
      region: 'Región Metropolitana',
      comuna: 'Ñuñoa',
      rol: 'cliente',
    };
    const respuesta = { ...sesion, telefono: '+56 9 1234 5678' };
    const fetchSpy = spyOn(window, 'fetch').and.callFake((url, opciones = {}) =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(opciones.method === 'PUT' ? respuesta : []),
      })
    );

    montar(sesion);

    fireEvent.click(screen.getByText('+ Agregar teléfono'));
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '+56 9 1234 5678' } });
    fireEvent.click(screen.getByText('Guardar Cambios'));

    await waitFor(() => expect(screen.getByText('¡Cambios guardados!')).toBeTruthy());

    const put = fetchSpy.calls.allArgs().find(([, o]) => o && o.method === 'PUT');
    expect(put[0]).toContain('/api/usuarios/5');
    expect(JSON.parse(put[1].body).telefono).toBe('+56 9 1234 5678');
    expect(JSON.parse(put[1].body).rol).toBe('cliente');
    console.log('[LOG][Perfil] OK: PUT enviado y datos guardados');
  });

  it('no guarda un teléfono inválido', () => {
    console.log('[LOG][Perfil] Inicio: validación de teléfono');

    montar({
      nombre: 'Gary',
      email: 'gary@duoc.cl',
      direccion: 'Pueblo Paleta 1',
      region: 'Región Metropolitana',
      comuna: 'Providencia',
    });

    fireEvent.click(screen.getByText('+ Agregar teléfono'));
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '123' } });
    fireEvent.click(screen.getByText('Guardar Cambios'));

    expect(screen.getByText('Ingresa un celular válido, ej: +56 9 1234 5678')).toBeTruthy();
    console.log('[LOG][Perfil] OK: teléfono inválido rechazado');
  });
});
