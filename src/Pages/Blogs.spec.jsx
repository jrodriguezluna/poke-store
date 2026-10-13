import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blogs from './Blogs';

describe('Vista Blogs', () => {
  it('permite abrir un artículo y volver al listado', () => {
    render(
      <MemoryRouter>
        <Blogs />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Noticias y Guías Pokémon' })).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: /leer artículo/i })[0]);

    expect(
      screen.getByRole('heading', {
        name: 'Cómo identificar cartas Pokémon graduadas falsas (PSA, Beckett y CGC)',
      })
    ).toBeTruthy();

    fireEvent.click(screen.getAllByRole('button', { name: /volver a noticias y guías/i })[0]);
    expect(screen.getByRole('heading', { name: 'Noticias y Guías Pokémon' })).toBeTruthy();
  });
});
