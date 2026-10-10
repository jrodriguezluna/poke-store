import { render, screen } from '@testing-library/react';
import Nosotros from './Nosotros';

describe('Nosotros Component', () => {
  it('renderiza correctamente las secciones de historia y los entrenadores del equipo', () => {
    render(<Nosotros />);

    // 1. Verificamos el título principal
    expect(screen.getByRole('heading', { name: 'Sobre Nosotros' })).toBeTruthy();

    // 2. Verificamos los títulos de las secciones principales
    expect(screen.getByRole('heading', { name: 'Orígenes' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Misión' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Garantía' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Nuestros entrenadores' })).toBeTruthy();

    // 3. Verificamos que aparezcan los 3 miembros del equipo
    expect(screen.getByText('Daniel')).toBeTruthy();
    expect(screen.getByText('Atención al cliente')).toBeTruthy();

    expect(screen.getByText('Esteban')).toBeTruthy();
    expect(screen.getByText('Control de calidad')).toBeTruthy();

    expect(screen.getByText('Jeff')).toBeTruthy();
    expect(screen.getByText('Logística y marketing')).toBeTruthy();
  });
});

