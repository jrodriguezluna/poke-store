import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import { getProductos } from '../services/api';
import { PRODUCTOS_MOCK } from '../data/productos';

const reviews = [
  { nombre: 'Esteban R.', estrellas: 4, texto: 'Mi peluche de Pikachu llegó perfecto thx.' },
  { nombre: 'Jefferson R.', estrellas: 5, texto: 'Excelente calidad en las figuras. Buena seleccion de Pokemones.' },
  { nombre: 'Ruben C.', estrellas: 5, texto: 'Buenos precios y variedad de cartas. Lo mejor.' },
];

const estrellas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function Home() {
  const [productos, setProductos] = useState(() => PRODUCTOS_MOCK.slice(0, 3));

  useEffect(() => {
    getProductos()
      .then((data) => setProductos(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="container">
      <section className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-2">
          Bienvenido a <span className="text-danger">Poke</span>Store
        </h1>
        <p className="lead text-secondary mb-4">
          Peluches, figuras y cartas de tus Pokémon favoritos.
        </p>

        <Carousel data-bs-theme="dark">
          {productos.map((producto) => (
            <Carousel.Item key={producto.id}>
              <Link
                to={`/producto/${producto.id}`}
                className="d-flex flex-column align-items-center px-5 pt-3 pb-5 text-decoration-none text-dark"
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="d-block mb-3"
                  style={{ height: 'clamp(200px, 40vw, 360px)', maxWidth: '100%', objectFit: 'contain' }}
                />
                <h2 className="h4 text-center">{producto.nombre}</h2>
                <p className="mb-1 text-secondary">{producto.categoria || producto.tipo}</p>
                <p className="mb-0 fw-bold text-danger">
                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(producto.precio)}
                </p>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>

        <Link to="/catalogo" className="btn btn-danger btn-lg mt-4">
          Ver catálogo
        </Link>
      </section>

      <section className="mb-4">
        <h2 className="h3 text-center mb-4">Lo que dicen nuestros clientes</h2>
        <div className="row g-4">
          {reviews.map(({ nombre, estrellas: n, texto }) => (
            <div key={nombre} className="col-12 col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="text-warning mb-2" aria-label={`${n} de 5 estrellas`}>
                    {estrellas(n)}
                  </div>
                  <p className="mb-3">“{texto}”</p>
                  <p className="fw-semibold small mb-0">{nombre}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
