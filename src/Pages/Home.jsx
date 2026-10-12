import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';

const artwork = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const slides = [
  { id: 25, titulo: 'Pikachu', texto: 'Peluches suaves para toda la familia' },
  { id: 6, titulo: 'Charizard', texto: 'Figuras coleccionables de edición especial' },
  { id: 150, titulo: 'Mewtwo', texto: 'Cartas raras para verdaderos entrenadores' },
];

const reviews = [
  { nombre: 'Esteban R.', estrellas: 4, texto: 'Mi peluche de Pikachu llegó perfecto thx.' },
  { nombre: 'Jefferson R.', estrellas: 5, texto: 'Excelente calidad en las figuras. Buena seleccion de Pokemones.' },
  { nombre: 'Ruben C.', estrellas: 5, texto: 'Buenos precios y variedad de cartas. Lo mejor.' },
];

const estrellas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function Home() {
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
          {slides.map(({ id, titulo, texto }) => (
            <Carousel.Item key={id}>
              <div className="d-flex flex-column align-items-center px-5 pt-3 pb-5">
                <img
                  src={artwork(id)}
                  alt={titulo}
                  className="d-block mb-3"
                  style={{ height: 'clamp(200px, 40vw, 360px)' }}
                />
                <h2 className="h4">{titulo}</h2>
                <p className="mb-0 text-secondary">{texto}</p>
              </div>
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
