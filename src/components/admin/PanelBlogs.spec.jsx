import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PanelBlogs from './PanelBlogs';

const BLOG = {
  id: 5,
  etiqueta: 'Guía',
  titulo: 'Cómo cuidar las cartas',
  resumen: 'Resumen del artículo',
  autor: 'Entrenador Sol',
  imagen: '/assets/cartas.jpg',
  textoAlternativo: 'Cartas',
  introduccion: 'Introducción del artículo',
  secciones: [{ id: 1, orden: 0, titulo: 'Guardado', texto: 'Usa fundas.' }],
  consejo: 'Evita la humedad.',
};

const respuesta = (data, ok = true, status = 200) =>
  Promise.resolve({ ok, status, json: () => Promise.resolve(data) });

const esperar = (condicion, mensaje = 'aún no se cumple la condición') =>
  waitFor(() => {
    if (!condicion()) throw new Error(mensaje);
  });

describe('Panel de blogs (admin)', () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = spyOn(window, 'fetch').and.callFake((url, options = {}) => {
      if (!options.method || options.method === 'GET') return respuesta([BLOG]);
      return respuesta(BLOG, true, options.method === 'POST' ? 201 : 200);
    });
  });

  it('lista los artículos de la API', async () => {
    render(<PanelBlogs />);

    expect(await screen.findByText('Cómo cuidar las cartas')).toBeTruthy();
    expect(screen.getByText('Guía · Entrenador Sol')).toBeTruthy();
  });

  it('muestra el editor ancho y con scroll independiente del encabezado y pie', async () => {
    render(<PanelBlogs />);
    await screen.findByText('Cómo cuidar las cartas');
    fireEvent.click(screen.getByRole('button', { name: /agregar blog/i }));

    const dialog = await screen.findByRole('dialog');
    const modalDialog = dialog.querySelector('.modal-dialog');
    const modalContent = modalDialog.querySelector('.modal-content');

    expect(modalDialog.classList.contains('modal-dialog-scrollable')).toBeTrue();
    expect(modalDialog.classList.contains('modal-xl')).toBeTrue();
    expect(modalDialog.classList.contains('modal-fullscreen-lg-down')).toBeTrue();
    expect(Array.from(modalContent.children).map((child) => child.className.split(' ')[0]))
      .toEqual(['modal-header', 'modal-body', 'modal-footer']);
  });

  it('crea un artículo con sus secciones', async () => {
    render(<PanelBlogs />);
    await screen.findByText('Cómo cuidar las cartas');
    fireEvent.click(screen.getByRole('button', { name: /agregar blog/i }));

    fireEvent.change(await screen.findByLabelText('Etiqueta'), { target: { value: 'Noticias' } });
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Nuevo artículo' } });
    fireEvent.change(screen.getByLabelText('Resumen'), { target: { value: 'Un resumen breve' } });
    fireEvent.change(screen.getByLabelText('Autor'), { target: { value: 'Entrenador' } });
    fireEvent.change(screen.getByLabelText('Introducción'), { target: { value: 'Texto inicial' } });
    fireEvent.change(screen.getByLabelText('Encabezado 1'), { target: { value: 'Primer tema' } });
    fireEvent.change(screen.getByLabelText('Contenido'), { target: { value: 'Contenido del tema' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }));

    await esperar(() => fetchSpy.calls.allArgs().some(([url, options]) =>
      String(url).includes('/api/blogs') && options?.method === 'POST'
    ), 'no se envió el POST');
    const [, options] = fetchSpy.calls.allArgs().find(([, request]) => request?.method === 'POST');
    const body = JSON.parse(options.body);
    expect(body.titulo).toBe('Nuevo artículo');
    expect(body.secciones[0].titulo).toBe('Primer tema');
    expect(body.secciones[0].texto).toBe('Contenido del tema');
    await esperar(() => screen.queryByRole('dialog') === null, 'el modal sigue abierto');
  });

  it('edita un artículo y envía los cambios', async () => {
    render(<PanelBlogs />);
    await screen.findByText('Cómo cuidar las cartas');
    fireEvent.click(screen.getByRole('button', { name: 'Editar Cómo cuidar las cartas' }));

    const titulo = await screen.findByLabelText('Título');
    fireEvent.change(titulo, { target: { value: 'Cartas bien cuidadas' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await esperar(() => fetchSpy.calls.allArgs().some(([url, options]) =>
      String(url).includes('/api/blogs/5') && options?.method === 'PUT'
    ), 'no se envió el PUT');
    const [, options] = fetchSpy.calls.allArgs().find(([, request]) => request?.method === 'PUT');
    expect(JSON.parse(options.body).titulo).toBe('Cartas bien cuidadas');
  });

  it('elimina el artículo después de confirmar', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    render(<PanelBlogs />);
    await screen.findByText('Cómo cuidar las cartas');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Cómo cuidar las cartas' }));

    await esperar(() => fetchSpy.calls.allArgs().some(([url, options]) =>
      String(url).includes('/api/blogs/5') && options?.method === 'DELETE'
    ), 'no se envió el DELETE');
  });
});
