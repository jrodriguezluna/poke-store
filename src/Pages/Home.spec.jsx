import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

describe('Vista Home', () => {
  it('renderiza el hero y el enlace al catálogo', () => {
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
    expect(screen.getByAltText('Pikachu')).toBeTruthy();

    // catalogo
    const enlace = screen.getByRole('link', { name: /ver catálogo/i });
    expect(enlace.getAttribute('href')).toBe('/catalogo');

    console.log('[LOG][Home] OK: hero y catálogo presentes');
  });
});
