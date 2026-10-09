import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCTOS_MOCK } from '../data/productos';

const CATEGORIAS = [
  { id: 'TODOS', label: 'Todas las Categorías' },
  { id: 'Peluches', label: 'Peluches' },
  { id: 'Coleccionable', label: 'Coleccionables' },
  { id: 'Hogar', label: 'Hogar' },
  { id: 'Ropa', label: 'Ropa y Accesorios' },
  { id: 'Libro', label: 'Libros y Guías' },
  { id: 'Juguetes', label: 'Juguetes' },
];

export default function Catalogo() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('TODOS');

  // Filtrado dinámico de productos
  const productosFiltrados = PRODUCTOS_MOCK.filter((producto) => {
    const coincideCategoria =
      categoriaSeleccionada === 'TODOS' || producto.categoria === categoriaSeleccionada;
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase().trim());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="container py-5">
      <div className="row">
        {/* Barra Lateral de Filtros */}
        <aside className="col-lg-3 mb-4">
          <div className="card p-3 shadow-sm border-0 sticky-top" style={{ top: '85px' }}>
            <h5 className="fw-bold mb-3">Filtrar Productos</h5>

            <div className="mb-3">
              <label htmlFor="buscar-producto" className="form-label small text-muted">
                Buscar por nombre:
              </label>
              <input
                type="text"
                id="buscar-producto"
                className="form-control form-control-sm"
                placeholder="Ej: Pikachu, Peluche..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <hr />

            <h6 className="fw-bold mb-2 small text-muted">Categorías:</h6>
            <div className="list-group list-group-flush" id="lista-categorias-filtro">
              {CATEGORIAS.map((cat) => {
                const isActive = categoriaSeleccionada === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${
                      isActive ? 'active fw-semibold' : ''
                    }`}
                    onClick={() => setCategoriaSeleccionada(cat.id)}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Grilla de Productos */}
        <main className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold mb-0">Catálogo de Productos</h3>
            <span className="text-muted small" id="contador-productos-visibles">
              {productosFiltrados.length === 1
                ? 'Mostrando 1 producto'
                : `Mostrando ${productosFiltrados.length} productos`}
            </span>
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="alert alert-info text-center py-4" role="alert">
              No se encontraron productos que coincidan con tu búsqueda.
            </div>
          ) : (
            <div className="row g-4" id="contenedor-todos-los-productos">
              {productosFiltrados.map((producto) => (
                <div key={producto.id} className="col-12 col-md-6 col-lg-4">
                  <ProductCard producto={producto} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}