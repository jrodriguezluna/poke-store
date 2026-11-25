import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import PanelUsuarios from './PanelUsuarios';


// Jasmine no lanza al fallar un expect, así que waitFor necesita un throw explícito
const esperar = (condicion, mensaje = 'aún no se cumple la condición') =>
  waitFor(() => {
    if (!condicion()) throw new Error(mensaje);
  });

const admin = { id: 99, nombre: 'Administrador', email: 'admin@pokestore.cl', rol: 'admin' };

const usuarios = [
  { id: 1, nombre: 'Ash Ketchum', email: 'ash@pokestore.cl', rol: 'cliente',
    telefono: null, direccion: 'Calle Falsa 123', region: 'Maule', comuna: 'Talca' },
  { id: 2, nombre: 'Misty', email: 'misty@pokestore.cl', rol: 'cliente',
    telefono: '+56 9 1234 5678', direccion: 'Av. Agua 45', region: 'Biobío', comuna: 'Concepción' },
  { id: 3, nombre: 'Brock', email: 'brock@pokestore.cl', rol: 'vendedor',
    telefono: null, direccion: 'Calle Roca 1', region: 'Maule', comuna: 'Talca' },
];

const respuesta = (data, ok = true) =>
  Promise.resolve({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });

const simularApi = (listaOk = true) =>
  spyOn(window, 'fetch').and.callFake((url, opciones = {}) => {
    const metodo = (opciones.method || 'GET').toUpperCase();
    if (metodo === 'GET') {
      return listaOk ? respuesta(usuarios) : respuesta({ detail: 'Fallo del servidor' }, false);
    }
    return respuesta({ ok: true });
  });

const llamadasCon = (fetchSpy, metodos) =>
  fetchSpy.calls.allArgs().filter(([, op]) => metodos.includes(((op && op.method) || 'GET').toUpperCase()));

const renderizar = () => {
  spyOn(Storage.prototype, 'getItem').and.callFake((clave) =>
    clave === 'poke_sesion' ? JSON.stringify(admin) : null
  );
  return render(
    <MemoryRouter>
      <AuthProvider>
        <PanelUsuarios />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Panel de usuarios (admin)', () => {
  it('lista los usuarios', async () => {
    console.log('[LOG][PanelUsuarios] Inicio: listado de usuarios');
    simularApi();
    renderizar();

    expect(await screen.findByText('Ash Ketchum')).toBeTruthy();
    expect(screen.getByText('misty@pokestore.cl')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Usuarios' })).toBeNull();
    console.log('[LOG][PanelUsuarios] OK: usuarios listados');
  });

  it('busca usuarios y filtra por rol', async () => {
    simularApi();
    renderizar();
    await screen.findByText('Ash Ketchum');

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar usuarios' }), {
      target: { value: 'brock@pokestore.cl' },
    });
    expect(screen.getByText('Brock')).toBeTruthy();
    expect(screen.queryByText('Ash Ketchum')).toBeNull();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar usuarios' }), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: 'Filtrar usuarios por rol' }), {
      target: { value: 'vendedor' },
    });
    expect(screen.getByText('Brock')).toBeTruthy();
    expect(screen.queryByText('Ash Ketchum')).toBeNull();
  });

  it('muestra un error si falla la carga de usuarios', async () => {
    console.log('[LOG][PanelUsuarios] Inicio: error al listar');
    simularApi(false);
    renderizar();

    expect(await screen.findByText('Fallo del servidor')).toBeTruthy();
    console.log('[LOG][PanelUsuarios] OK: error mostrado');
  });

  it('elimina un usuario cuando se confirma', async () => {
    console.log('[LOG][PanelUsuarios] Inicio: eliminar con confirmación');
    const fetchSpy = simularApi();
    spyOn(window, 'confirm').and.returnValue(true);
    renderizar();

    await screen.findByText('Ash Ketchum');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Ash Ketchum' }));

    await esperar(() => llamadasCon(fetchSpy, ['DELETE']).length === 1, 'no se envió el DELETE');
    expect(llamadasCon(fetchSpy, ['DELETE'])[0][0]).toContain('/1');
    console.log('[LOG][PanelUsuarios] OK: DELETE enviado');
  });

  it('no elimina si se cancela la confirmación', async () => {
    console.log('[LOG][PanelUsuarios] Inicio: eliminar cancelado');
    const fetchSpy = simularApi();
    spyOn(window, 'confirm').and.returnValue(false);
    renderizar();

    await screen.findByText('Ash Ketchum');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Ash Ketchum' }));

    expect(llamadasCon(fetchSpy, ['DELETE']).length).toBe(0);
    console.log('[LOG][PanelUsuarios] OK: no se envió DELETE');
  });

  it('edita un usuario en la ventana flotante y envía los cambios', async () => {
    console.log('[LOG][PanelUsuarios] Inicio: editar usuario');
    const fetchSpy = simularApi();
    renderizar();

    await screen.findByText('Ash Ketchum');
    fireEvent.click(screen.getByRole('button', { name: 'Editar Ash Ketchum' }));

    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByLabelText('Rol').querySelector('option[value="vendedor"]')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ash Nuevo' } });
    fireEvent.change(screen.getByLabelText('Rol'), { target: { value: 'vendedor' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await esperar(() => llamadasCon(fetchSpy, ['PUT', 'PATCH']).length === 1, 'no se envió la edición');
    const [url, opciones] = llamadasCon(fetchSpy, ['PUT', 'PATCH'])[0];
    expect(url).toContain('/1');
    expect(JSON.parse(opciones.body).nombre).toBe('Ash Nuevo');
    expect(JSON.parse(opciones.body).rol).toBe('vendedor');
    await esperar(() => screen.queryByRole('dialog') === null, 'la ventana sigue abierta');
    console.log('[LOG][PanelUsuarios] OK: edición enviada y ventana cerrada');
  });
});
