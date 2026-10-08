import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-light mt-auto py-4">
      <div className="container">
        <div className="row gy-3">
          <div className="col-12 col-md-4">
            <h2 className="h5">
              <span className="text-danger">Poke</span>Store
            </h2>
            <p className="small text-secondary mb-0">
              Tu tienda de Pokémon: encuentra tus favoritos y llévalos a casa.
            </p>
          </div>

          <nav className="col-6 col-md-4" aria-label="Tienda">
            <h2 className="h6">Tienda</h2>
            <ul className="list-unstyled small mb-0">
              <li><Link className="link-light" to="/catalogo">Catálogo</Link></li>
              <li><Link className="link-light" to="/carrito">Carrito</Link></li>
              <li><Link className="link-light" to="/nosotros">Nosotros</Link></li>
            </ul>
          </nav>

          <nav className="col-6 col-md-4" aria-label="Ayuda">
            <h2 className="h6">Ayuda</h2>
            <ul className="list-unstyled small mb-0">
              <li><Link className="link-light" to="/contacto">Contacto</Link></li>
            </ul>
          </nav>
        </div>

        <hr className="border-secondary my-3" />
        <p className="small text-secondary text-center mb-0">
          © {new Date().getFullYear()} PokeStore. Proyecto académico DSY1104.
        </p>
      </div>
    </footer>
  );
}

export default Footer;