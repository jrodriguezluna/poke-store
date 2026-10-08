import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navbar.css';

const enlaces = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/Catalogo', label: 'Catálogo' },
  { to: '/Producto/1', label: 'Detalle' },
  { to: '/Carrito', label: 'Carrito' },
  { to: '/Checkout', label: 'Checkout' },
  { to: '/Login', label: 'Login' },
  { to: '/Contacto', label: 'Contacto' },
  { to: '/Perfil', label: 'Perfil' },
  { to: '/Nosotros', label: 'Nosotros' },
];

function AppNavbar() {
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">
          <span className="text-danger">Poke</span>Store
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menuPrincipal" />

        <Navbar.Collapse id="menuPrincipal">
          <Nav className="me-auto">
            {enlaces.map(({ to, label, end }) => (
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
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;