import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const enlacesIzquierda = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/perfil', label: 'Perfil' },
];

function renderEnlaces(enlaces) {
  return enlaces.map(({ to, label, end }) => (
    <Nav.Link
      key={to}
      as={NavLink}
      to={to}
      end={end}
      className="nav-hover"
      data-text={label}
    >
      {label}
    </Nav.Link>
  ));
}

function AppNavbar() {
  const { user, logout } = useAuth();

  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">
          <span className="text-danger">Poke</span>Store
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menuPrincipal" />

        <Navbar.Collapse id="menuPrincipal">
          <Nav className="me-auto">{renderEnlaces(enlacesIzquierda)}</Nav>
          <Nav className="ms-lg-auto">
            {renderEnlaces([{ to: '/carrito', label: 'Carrito' }])}
            {user ? (
              <Nav.Link as="button" type="button" onClick={logout}>
                Salir
              </Nav.Link>
            ) : (
              renderEnlaces([{ to: '/login', label: 'Login' }])
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
