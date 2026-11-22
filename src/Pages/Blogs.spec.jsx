import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blogs from './Blogs';

const ARTICULOS = [{
  id: 1,
  etiqueta: 'Guía de Autenticidad',
  titulo: 'Cómo identificar cartas Pokémon graduadas falsas (PSA, Beckett y CGC)',
  resumen: 'Aprende a revisar certificaciones.',
  autor: 'Entrenador Daniel',
  imagen: '/assets/img/blogs/CartasGradeadas.jpg',
  textoAlternativo: 'Cartas Pokémon graduadas',
  introduccion: 'Introducción de prueba.',
  secciones: [{ id: 1, orden: 0, titulo: 'Verificación', texto: 'Revisa el código.' }],
  consejo: 'Compra con confianza.',
}];

describe('Vista Blogs', () => {
  beforeEach(() => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(ARTICULOS),
    }));
  });

  it('carga los artículos desde la API y permite abrir y cerrar un artículo', async () => {
    render(
      <MemoryRouter>
        <Blogs />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Noticias y Guías Pokémon' })).toBeTruthy();
    expect(await screen.findByText('Aprende a revisar certificaciones.')).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: /leer artículo/i })[0]);

    expect(
      screen.getByRole('heading', {
        name: 'Cómo identificar cartas Pokémon graduadas falsas (PSA, Beckett y CGC)',
      })
    ).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Verificación' })).toBeTruthy();

    fireEvent.click(screen.getAllByRole('button', { name: /volver a noticias y guías/i })[0]);
    expect(screen.getByRole('heading', { name: 'Noticias y Guías Pokémon' })).toBeTruthy();
  });
});
