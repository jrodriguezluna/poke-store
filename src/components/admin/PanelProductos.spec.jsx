import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductosProvider } from '../../context/ProductosContext';
import PanelProductos from './PanelProductos';


// Jasmine no lanza al fallar un expect, así que waitFor necesita un throw explícito
const esperar = (condicion, mensaje = 'aún no se cumple la condición') =>
  waitFor(() => {
    if (!condicion()) throw new Error(mensaje);
  });

const PRODUCTOS = [
  { id: 1, nombre: 'Pikachu Peluche', categoria: 'Peluches', precio: 15000, stock: 5 },
  { id: 2, nombre: 'Charmander Figura', categoria: 'Figuras', precio: 22000, stock: 2 },
];

const respuesta = (data, ok = true, status = 200) =>
  Promise.resolve({ ok, status, json: () => Promise.resolve(data) });

const renderPanel = () =>
  render(
    <ProductosProvider>
      <PanelProductos />
    </ProductosProvider>
  );

describe('Panel de productos (admin)', () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = spyOn(window, 'fetch').and.callFake((url, opts = {}) => {
      if (!opts.method || opts.method === 'GET') return respuesta(PRODUCTOS);
      return respuesta({});
    });
  });

  it('lista los productos', async () => {
    console.log('[LOG][PanelProductos] Inicio: lista productos');
    renderPanel();

    expect(await screen.findByText('Pikachu Peluche')).toBeTruthy();
    expect(screen.getByText('Charmander Figura')).toBeTruthy();
    expect(screen.getAllByText('Stock bajo').length).toBeGreaterThan(0);
    expect(screen.queryByRole('heading', { name: 'Productos' })).toBeNull();
    console.log('[LOG][PanelProductos] OK: productos en lista');
  });

  it('busca productos y filtra por categoría', async () => {
    renderPanel();
    await screen.findByText('Pikachu Peluche');

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar productos' }), {
      target: { value: 'Charmander' },
    });
    expect(screen.getByText('Charmander Figura')).toBeTruthy();
    expect(screen.queryByText('Pikachu Peluche')).toBeNull();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar productos' }), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: 'Filtrar productos por categoría' }), {
      target: { value: 'Peluches' },
    });
    expect(screen.getByText('Pikachu Peluche')).toBeTruthy();
    expect(screen.queryByText('Charmander Figura')).toBeNull();
  });

  it('abre la ventana flotante para agregar un producto', async () => {
    console.log('[LOG][PanelProductos] Inicio: ventana de agregar');
    renderPanel();
    await screen.findByText('Pikachu Peluche');

    fireEvent.click(screen.getByRole('button', { name: /agregar producto/i }));

    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('button', { name: /agregar producto/i }).classList.contains('btn-success')).toBeTrue();
    expect(screen.getByLabelText('Nombre')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Crear' })).toBeTruthy();
    console.log('[LOG][PanelProductos] OK: ventana abierta');
  });

  it('crea un producto con precio y stock y cierra la ventana', async () => {
    console.log('[LOG][PanelProductos] Inicio: crear producto');
    renderPanel();
    await screen.findByText('Pikachu Peluche');

    fireEvent.click(screen.getByRole('button', { name: /agregar producto/i }));
    fireEvent.change(await screen.findByLabelText('Nombre'), { target: { value: 'Eevee' } });
    fireEvent.change(screen.getByLabelText(/precio/i), { target: { value: '9990' } });
    fireEvent.change(screen.getByLabelText('Stock'), { target: { value: '7' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }));

    await esperar(() => fetchSpy.calls.allArgs().some(([, o]) => o?.method === 'POST'), 'no se envió el POST');
    const post = fetchSpy.calls.allArgs().find(([, o]) => o?.method === 'POST');
    const body = JSON.parse(post[1].body);
    expect(body.nombre).toBe('Eevee');
    expect(body.precio).toBe(9990);
    expect(body.stock).toBe(7);
    await esperar(() => screen.queryByRole('dialog') === null, 'la ventana sigue abierta');
    console.log('[LOG][PanelProductos] OK: enviado y ventana cerrada');
  });

  it('edita un producto y vuelve a pedir la lista para reflejar el cambio', async () => {
    console.log('[LOG][PanelProductos] Inicio: editar producto');
    renderPanel();
    await screen.findByText('Pikachu Peluche');
    const getsAntes = fetchSpy.calls.allArgs().filter(([, o]) => !o?.method).length;

    fireEvent.click(screen.getByRole('button', { name: 'Editar Pikachu Peluche' }));
    const nombre = await screen.findByLabelText('Nombre');
    expect(nombre.value).toBe('Pikachu Peluche');
    fireEvent.change(nombre, { target: { value: 'Pikachu Gigante' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await esperar(() => fetchSpy.calls.allArgs().some(([, o]) => o?.method === 'PUT'), 'no se envió el PUT');
    const put = fetchSpy.calls.allArgs().find(([, o]) => o?.method === 'PUT');
    expect(put[0]).toContain('/api/productos/1');
    expect(JSON.parse(put[1].body).nombre).toBe('Pikachu Gigante');
    await esperar(
      () => fetchSpy.calls.allArgs().filter(([, o]) => !o?.method).length > getsAntes,
      'la lista no se volvió a pedir'
    );
    console.log('[LOG][PanelProductos] OK: PUT + recarga de la lista');
  });

  it('elimina un producto cuando se confirma', async () => {
    console.log('[LOG][PanelProductos] Inicio: eliminar producto');
    spyOn(window, 'confirm').and.returnValue(true);
    renderPanel();
    await screen.findByText('Pikachu Peluche');

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Pikachu Peluche' }));

    await esperar(() => fetchSpy.calls.allArgs().some(([, o]) => o?.method === 'DELETE'), 'no se envió el DELETE');
    const del = fetchSpy.calls.allArgs().find(([, o]) => o?.method === 'DELETE');
    expect(del[0]).toContain('/api/productos/1');
    console.log('[LOG][PanelProductos] OK: DELETE');
  });

  it('muestra el error dentro de la ventana si falla al guardar', async () => {
    console.log('[LOG][PanelProductos] Inicio: error al guardar');
    renderPanel();
    await screen.findByText('Pikachu Peluche');
    fetchSpy.and.callFake((url, opts = {}) =>
      !opts.method ? respuesta(PRODUCTOS) : respuesta({ detail: 'Stock inválido' }, false, 422)
    );

    fireEvent.click(screen.getByRole('button', { name: 'Editar Pikachu Peluche' }));
    await screen.findByLabelText('Nombre');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Stock inválido')).toBeTruthy();
    expect(screen.getByRole('dialog')).toBeTruthy(); // la ventana sigue abierta
    console.log('[LOG][PanelProductos] OK: error mostrado en la ventana');
  });

  it('muestra el error si falla al cargar', async () => {
    console.log('[LOG][PanelProductos] Inicio: error de API');
    fetchSpy.and.callFake(() => respuesta({ detail: 'Servidor caído' }, false, 500));
    renderPanel();

    expect(await screen.findByText('Servidor caído')).toBeTruthy();
    console.log('[LOG][PanelProductos] OK: error mostrado');
  });
});
