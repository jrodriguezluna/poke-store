import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTOS_MOCK } from '../data/productos';

export default function Detalle() {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);
  const [alertaAgregado, setAlertaAgregado] = useState(false);

  // Buscar el producto por ID en nuestro dataset mock
  const producto = PRODUCTOS_MOCK.find((item) => item.id === Number(id));

  // Resetear la cantidad y alerta cuando cambie el ID del producto
  useEffect(() => {
    setCantidad(1);
    setAlertaAgregado(false);
  }, [id]);

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning py-4" role="alert">
          <h4 className="alert-heading fw-bold">¡Producto no encontrado!</h4>
          <p className="mb-3">El producto que buscas no existe o fue removido.</p>
          <Link to="/catalogo" className="btn btn-primary">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Formato de precio en moneda chilena
  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(producto.precio);

  const handleSumar = () => {
    if (cantidad < producto.stock) {
      setCantidad((prev) => prev + 1);
    }
  };

  const handleRestar = () => {
    if (cantidad > 1) {
      setCantidad((prev) => prev - 1);
    }
  };

  const handleAgregarAlCarrito = () => {
    setAlertaAgregado(true);
    // Ocultar alerta automáticamente después de 3 segundos
    setTimeout(() => {
      setAlertaAgregado(false);
    }, 3000);
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb dinámico */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb" id="breadcrumb-contenedor">
          <li className="breadcrumb-item">
            <Link to="/">Inicio</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/catalogo">Productos</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page" id="breadcrumb-producto">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      {/* Contenedor Principal del Detalle */}
      <div className="card shadow-sm border-0 p-4 mb-4" id="contenedor-detalle">
        <div className="row g-4 align-items-center">
          {/* Columna Imagen */}
          <div className="col-lg-6">
            <div className="p-4 bg-white border rounded text-center mb-3">
              <img
                id="detalle-imagen-principal"
                src={producto.imagen}
                className="card-img-main img-fluid object-fit-contain"
                alt={producto.nombre}
                style={{ maxHeight: '350px' }}
              />
            </div>
          </div>

          {/* Columna Información de Compra */}
          <div className="col-lg-6 ps-lg-4">
            <span className="badge bg-primary mb-2" id="detalle-categoria">
              {producto.categoria}
            </span>
            <small className="text-muted ms-2" id="detalle-codigo">
              Código: {producto.codigo || `PROD-${producto.id}`}
            </small>

            <h1 className="display-6 fw-bold mb-2 text-dark" id="detalle-nombre">
              {producto.nombre}
            </h1>

            <div className="d-flex align-items-baseline gap-3 my-3">
              <span className="fs-2 fw-bold text-success" id="detalle-precio">
                {precioFormateado}
              </span>
              <span
                className="badge bg-success-subtle text-success border border-success px-2 py-1"
                id="detalle-stock"
              >
                En Stock: {producto.stock} unidades
              </span>
            </div>

            <hr />

            <h6 className="fw-bold text-secondary">Descripción:</h6>
            <p className="text-muted leading-relaxed" id="detalle-descripcion">
              {producto.descripcion}
            </p>

            <hr className="my-4" />

            {/* Selector de Cantidad y Botón Añadir al Carrito */}
            <div className="row g-3 align-items-center mb-3">
              <div className="col-auto">
                <label htmlFor="detalle-cantidad" className="fw-bold me-2">
                  Cantidad:
                </label>
              </div>
              <div className="col-auto">
                <div className="input-group" style={{ width: '140px' }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="btn-restar-cant"
                    onClick={handleRestar}
                    disabled={cantidad <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="detalle-cantidad"
                    className="form-control text-center fw-bold"
                    value={cantidad}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="btn-sumar-cant"
                    onClick={handleSumar}
                    disabled={cantidad >= producto.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
              id="btn-agregar-carrito"
              onClick={handleAgregarAlCarrito}
            >
              Añadir al carrito
            </button>

            {/* Alerta dinámica de confirmación */}
            {alertaAgregado && (
              <div
                id="alerta-agregado"
                className="alert alert-success mt-3 text-center"
                role="alert"
              >
                ¡Producto añadido al carrito con éxito! ({cantidad} unidades)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}