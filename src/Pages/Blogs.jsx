import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarBlogs } from '../services/api';

function Articulo({ articulo, volver }) {
  return (
    <article>
      <button type="button" className="btn btn-link px-0 mb-4 text-decoration-none" onClick={volver}>
        ← Volver a Noticias y Guías
      </button>

      <div className="mx-auto" style={{ maxWidth: '860px' }}>
        <div className="mb-3">
          <span className="badge bg-danger">{articulo.etiqueta}</span>
          <span className="text-muted small ms-2">Por {articulo.autor}</span>
        </div>
        <h1 className="fw-bold mb-4">{articulo.titulo}</h1>
        {articulo.imagen && (
          <img
            src={articulo.imagen}
            className="img-fluid rounded mb-4 w-100"
            alt={articulo.textoAlternativo || ''}
            style={{ maxHeight: '440px', objectFit: 'cover' }}
          />
        )}
        <div className="text-secondary fs-5 lh-lg">
          <p>{articulo.introduccion}</p>
          {(articulo.secciones ?? []).map((seccion) => (
            <section className="mt-4" key={seccion.titulo}>
              <h2 className="h4 fw-bold text-dark">{seccion.titulo}</h2>
              <p>{seccion.texto}</p>
            </section>
          ))}
          {articulo.consejo && (
            <aside className="alert alert-info border-0 mt-4">
              <h2 className="h5 fw-bold">Consejo PokeStore</h2>
              <p className="mb-0">{articulo.consejo}</p>
            </aside>
          )}
        </div>
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mt-5 pt-3 border-top">
          <button type="button" className="btn btn-outline-secondary" onClick={volver}>
            ← Volver a Noticias y Guías
          </button>
          <Link to="/catalogo" className="btn btn-primary">Explorar catálogo</Link>
        </div>
      </div>
    </article>
  );
}

export default function Blogs() {
  const [articulos, setArticulos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

  useEffect(() => {
    let activo = true;
    listarBlogs()
      .then((data) => {
        if (activo) setArticulos(data);
      })
      .catch((err) => {
        if (activo) setError(err.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="container py-5">
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {articuloSeleccionado ? (
        <Articulo articulo={articuloSeleccionado} volver={() => setArticuloSeleccionado(null)} />
      ) : (
        <>
          <header className="text-center mb-5">
            <p className="text-danger fw-bold text-uppercase mb-2">PokeStore · Aprende y colecciona</p>
            <h1 className="fw-bold display-5">Noticias y Guías Pokémon</h1>
            <p className="text-muted mb-0">Consejos para cuidar tu colección y comprar con confianza.</p>
          </header>

          {cargando ? (
            <div className="text-center py-5" role="status">Cargando artículos...</div>
          ) : articulos.length === 0 ? (
            <div className="alert alert-info text-center">Todavía no hay artículos publicados.</div>
          ) : (
            <div className="row g-4">
              {articulos.map((articulo) => (
                <div className="col-12 col-lg-6" key={articulo.id}>
                  <article className="card h-100 border-0 shadow-sm overflow-hidden">
                    {articulo.imagen && (
                      <img
                        src={articulo.imagen}
                        className="card-img-top"
                        alt={articulo.textoAlternativo || ''}
                        style={{ height: '260px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body d-flex flex-column p-4">
                      <span className="badge bg-danger align-self-start mb-3">{articulo.etiqueta}</span>
                      <h2 className="h4 fw-bold">{articulo.titulo}</h2>
                      <p className="text-muted">{articulo.resumen}</p>
                      <button
                        type="button"
                        className="btn btn-outline-dark align-self-start mt-auto"
                        onClick={() => setArticuloSeleccionado(articulo)}
                      >
                        Leer artículo <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
