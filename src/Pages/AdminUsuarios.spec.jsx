import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import AdminUsuarios from './AdminUsuarios';

const admin = { id: 99, nombre: 'Administrador', email: 'admin@pokestore.cl', rol: 'admin' };
const cliente = { id: 5, nombre: 'Brock', email: 'brock@pokestore.cl', rol: 'cliente' };

const usuarios = [
  { id: 1, nombre: 'Ash Ketchum', email: 'ash@pokestore.cl', rol: 'cliente',
    telefono: null, direccion: 'Calle Falsa 123', region: 'Maule', comuna: 'Talca' },
  { id: 2, nombre: 'Misty', email: 'misty@pokestore.cl', rol: 'cliente',
    telefono: '+56 9 1234 5678', direccion: 'Av. Agua 45', region: 'Biobío', comuna: 'Concepción' },
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

const renderizar = (usuarioSesion) => {
  spyOn(Storage.prototype, 'getItem').and.callFake((clave) =>
    clave === 'poke_sesion' && usuarioSesion ? JSON.stringify(usuarioSesion) : null
  );
  return render(
    <MemoryRouter initialEntries={['/admin/usuarios']}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<h1>Inicio</h1>} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Vista AdminUsuarios', () => {
  it('redirige al inicio si el usuario no es admin', async () => {
    console.log('[LOG][AdminUsuarios] Inicio: bloqueo a no admin');
    simularApi();
    renderizar(cliente);

    expect(await screen.findByText('Inicio')).toBeTruthy();
    expect(screen.queryByText('Usuarios')).toBeNull();
    console.log('[LOG][AdminUsuarios] OK: redirigido al inicio');
  });

  it('lista los usuarios cuando es admin', async () => {
    console.log('[LOG][AdminUsuarios] Inicio: listado de usuarios');
    simularApi();
    renderizar(admin);

    expect(await screen.findByText('Ash Ketchum')).toBeTruthy();
    expect(screen.getByText('misty@pokestore.cl')).toBeTruthy();
    console.log('[LOG][AdminUsuarios] OK: usuarios listados');
  });

  it('muestra un error si falla la carga de usuarios', async () => {
    console.log('[LOG][AdminUsuarios] Inicio: error al listar');
    simularApi(false);
    const { container } = renderizar(admin);

    await waitFor(() => {
      if (!container.querySelector('.alert-danger')) throw new Error('aún no aparece el error');
    });
    expect(container.querySelector('.alert-danger')).toBeTruthy();
    console.log('[LOG][AdminUsuarios] OK: error mostrado');
  });

  it('elimina un usuario cuando se confirma', async () => {
    console.log('[LOG][AdminUsuarios] Inicio: eliminar con confirmación');
    const fetchSpy = simularApi();
    spyOn(window, 'confirm').and.returnValue(true);
    renderizar(admin);

    await screen.findByText('Ash Ketchum');
    fireEvent.click(screen.getAllByRole('button', { name: /eliminar/i })[0]);

    await waitFor(() => {
      if (llamadasCon(fetchSpy, ['DELETE']).length === 0) throw new Error('aún no se llamó DELETE');
    });
    const [url] = llamadasCon(fetchSpy, ['DELETE'])[0];
    expect(url).toContain('/1');
    console.log('[LOG][AdminUsuarios] OK: DELETE enviado');
  });

  it('no elimina si se cancela la confirmación', async () => {
    console.log('[LOG][AdminUsuarios] Inicio: eliminar cancelado');
    const fetchSpy = simularApi();
    spyOn(window, 'confirm').and.returnValue(false);
    renderizar(admin);

    await screen.findByText('Ash Ketchum');
    fireEvent.click(screen.getAllByRole('button', { name: /eliminar/i })[0]);

    expect(llamadasCon(fetchSpy, ['DELETE']).length).toBe(0);
    console.log('[LOG][AdminUsuarios] OK: no se envió DELETE');
  });

  it('edita un usuario y envía los cambios', async () => {
    console.log('[LOG][AdminUsuarios] Inicio: editar usuario');
    const fetchSpy = simularApi();
    renderizar(admin);

    await screen.findByText('Ash Ketchum');
    fireEvent.click(screen.getAllByRole('button', { name: /editar/i })[0]);

    fireEvent.change(screen.getByPlaceholderText('nombre'), { target: { value: 'Ash Nuevo' } });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      if (llamadasCon(fetchSpy, ['PUT', 'PATCH']).length === 0) throw new Error('aún no se envió la edición');
    });
    const [url, opciones] = llamadasCon(fetchSpy, ['PUT', 'PATCH'])[0];
    expect(url).toContain('/1');
    expect(JSON.parse(opciones.body).nombre).toBe('Ash Nuevo');
    console.log('[LOG][AdminUsuarios] OK: edición enviada');
  });
});