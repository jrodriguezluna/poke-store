import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import AdminProductos from './AdminProductos';

const PRODUCTOS = [
  { id: 1, nombre: 'Pikachu Peluche', categoria: 'Peluches', precio: 15000, stock: 5 },
  { id: 2, nombre: 'Charmander Figura', categoria: 'Figuras', precio: 22000, stock: 2 },
];

const respuesta = (data, ok = true, status = 200) =>
  Promise.resolve({ ok, status, json: () => Promise.resolve(data) });

const renderAdmin = (rol = 'admin') => {
  localStorage.setItem('poke_sesion', JSON.stringify({ id: 1, nombre: 'Test', rol }));
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AdminProductos />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Vista AdminProductos', () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = spyOn(window, 'fetch').and.callFake((url, opts = {}) => {
      if (!opts.method || opts.method === 'GET') return respuesta(PRODUCTOS);
      return respuesta({});
    });
  });

  afterEach(() => localStorage.clear());

  it('lista de los productos', async () => {
    console.log('[LOG][AdminProductos] Inicio: lista productos');
    renderAdmin();

    expect(await screen.findByText('Pikachu Peluche')).toBeTruthy();
    expect(screen.getByText('Charmander Figura')).toBeTruthy();
    console.log('[LOG][AdminProductos] OK: productos en lista');
  });

  it('no muestra la tabla si el usuario no es admin', () => {
    console.log('[LOG][AdminProductos] Inicio: acceso de no admin');
    renderAdmin('cliente');

    expect(screen.queryByText('Productos')).toBeNull();
    console.log('[LOG][AdminProductos] OK: usuario no admin redirigido');
  });

  it('formulario', async () => {
    console.log('[LOG][AdminProductos] Inicio: formulario');
    renderAdmin();
    await screen.findByText('Pikachu Peluche');

    fireEvent.click(screen.getByRole('button', { name: /agregar producto/i }));

    expect(screen.getByPlaceholderText('nombre')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Crear' })).toBeTruthy();
    console.log('[LOG][AdminProductos] OK: formulario');
  });

  it('crea un producto con precio y stock', async () => {
    console.log('[LOG][AdminProductos] Inicio: crear producto');
    renderAdmin();
    await screen.findByText('Pikachu Peluche');

    fireEvent.click(screen.getByRole('button', { name: /agregar producto/i }));
    fireEvent.change(screen.getByPlaceholderText('nombre'), { target: { value: 'Eevee' } });
    fireEvent.change(screen.getByPlaceholderText('precio'), { target: { value: '9990' } });
    fireEvent.change(screen.getByPlaceholderText('stock'), { target: { value: '7' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }));

    await waitFor(() => {
      const post = fetchSpy.calls.allArgs().find(([, o]) => o?.method === 'POST');
      expect(post).toBeTruthy();
      const body = JSON.parse(post[1].body);
      expect(body.nombre).toBe('Eevee');
      expect(body.precio).toBe(9990);
      expect(body.stock).toBe(7);
    });
    console.log('[LOG][AdminProductos] OK: enviado');
  });

  it('elimina producto', async () => {
    console.log('[LOG][AdminProductos] Inicio: eliminar producto');
    spyOn(window, 'confirm').and.returnValue(true);
    renderAdmin();
    await screen.findByText('Pikachu Peluche');

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]);

    await waitFor(() => {
      const del = fetchSpy.calls.allArgs().find(([, o]) => o?.method === 'DELETE');
      expect(del).toBeTruthy();
      expect(del[0]).toContain('/api/productos/1');
    });
    console.log('[LOG][AdminProductos] OK: DELETE');
  });

  it('muestra el error si falla al cargar', async () => {
    console.log('[LOG][AdminProductos] Inicio: error de API');
    fetchSpy.and.callFake(() => respuesta({ detail: 'Servidor caído' }, false, 500));
    renderAdmin();

    expect(await screen.findByText('Servidor caído')).toBeTruthy();
    console.log('[LOG][AdminProductos] OK: error en la consola');
  });
});
