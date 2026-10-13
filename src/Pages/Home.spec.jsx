import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PRODUCTOS_MOCK } from '../data/productos';
import Home from './Home';

describe('Vista Home', () => {
  beforeEach(() => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(PRODUCTOS_MOCK), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }))
    );
  });

  it('renderiza productos en el carrusel y el enlace al catálogo', async () => {
    console.log('[LOG][Home] Inicio: render hero y catálogo');
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Hero
    const titulo = screen.getByRole('heading', { level: 1 });
    expect(titulo.textContent).toContain('Bienvenido a');
    expect(titulo.textContent).toContain('PokeStore');

    // Hero carusel
    await waitFor(() => {
      expect(screen.getByAltText('Peluche Pikachu 30cm')).toBeTruthy();
    });
    expect(screen.getByRole('link', { name: /Peluche Pikachu 30cm/i }).getAttribute('href'))
      .toBe('/producto/1');

    // catalogo
    const enlace = screen.getByRole('link', { name: /ver catálogo/i });
    expect(enlace.getAttribute('href')).toBe('/catalogo');

    console.log('[LOG][Home] OK: hero y catálogo presentes');
  });
});
