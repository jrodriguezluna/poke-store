import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTOS_MOCK } from '../data/productos';

export default function Carrito() {
  // Inicializamos el carrito con un par de productos del mock para poder probarlo de inmediato
  const [items, setItems] = useState([
    { ...PRODUCTOS_MOCK[0], cantidad: 2 }, // Pikachu x2
    { ...PRODUCTOS_MOCK[1], cantidad: 1 }, // Charizard x1
  ]);

  const [ordenExitosa, setOrdenExitosa] = useState(null);

  // Funciones de control del carrito
  const incrementarCantidad = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const decrementarCantidad = (id) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminarItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  // Cálculo del total
  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const totalFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(total);

  const handlePagar = () => {
    const ordenId = Math.floor(1000 + Math.random() * 9000);
    setOrdenExitosa({
      id: ordenId,
      monto: totalFormateado,
    });
    setItems([]); // Vaciamos el carrito tras procesar la compra
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Mi carrito de compras</h2>

      <div className="row g-4">
        {/* Columna Izquierda: Lista de Productos */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4" id="contenedor-items-carrito">
              {items.length === 0 ? (
                <div className="text-center py-5">
                  <h4 className="text-muted fw-bold mb-3">Tu carrito está vacío 🛒</h4>
                  <p className="text-secondary mb-4">
                    ¡Explora nuestro catálogo para añadir tus productos favoritos de Pokémon!
                  </p>
                  <Link to="/catalogo" className="btn btn-primary fw-bold">
                    Ir al Catálogo
                  </Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {items.map((item) => {
                    const subtotalItem = new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                    }).format(item.precio * item.cantidad);

                    return (
                      <div
                        key={item.id}
                        className="d-flex flex-column flex-sm-row align-items-center justify-content-between p-3 border rounded bg-white gap-3"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            style={{ width: '65px', height: '65px', objectFit: 'contain' }}
                          />
                          <div>
                            <h6 className="fw-bold mb-1">{item.nombre}</h6>
                            <span className="badge bg-secondary mb-1">{item.categoria}</span>
                            <div className="small text-muted">
                              Precio unitario: ${item.precio.toLocaleString('es-CL')}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-4">
                          {/* Controles de Cantidad */}
                          <div className="input-group input-group-sm" style={{ width: '110px' }}>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => decrementarCantidad(item.id)}
                            >
                              -
                            </button>
                            <span className="form-control text-center fw-bold bg-light">
                              {item.cantidad}
                            </span>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => incrementarCantidad(item.id)}
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal Item */}
                          <div className="text-end" style={{ minWidth: '90px' }}>
                            <div className="fw-bold text-success">{subtotalItem}</div>
                          </div>

                          {/* Eliminar Item */}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            title="Eliminar producto"
                            onClick={() => eliminarItem(item.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/catalogo" className="btn btn-outline-primary">
                ← Seguir comprando
              </Link>
              <button
                id="btn-vaciar-carrito"
                className="btn btn-outline-danger btn-sm"
                onClick={vaciarCarrito}
              >
                Vaciar carrito completo
              </button>
            </div>
          )}
        </div>

        {/* Columna Derecha: Resumen de Compra */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '85px' }}>
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-3">Resumen de Compra</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span className="fw-bold" id="resumen-subtotal">
                  {totalFormateado}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <span className="fs-5 fw-bold">TOTAL:</span>
                <span className="fw-bold fs-3 text-success" id="resumen-total">
                  {totalFormateado}
                </span>
              </div>

              <div className="d-flex flex-column gap-2">
                <button
                  className="btn btn-success w-100 btn-lg fw-bold py-3 shadow-sm"
                  id="btn-pagar"
                  disabled={items.length === 0}
                  onClick={handlePagar}
                >
                  PAGAR RÁPIDO
                </button>
                <Link
                  to="/checkout"
                  className={`btn btn-outline-success w-100 fw-bold py-2 ${
                    items.length === 0 ? 'disabled' : ''
                  }`}
                >
                  Proceder al Checkout →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Alerta de Confirmación de Pago Exitoso */}
      {ordenExitosa && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">¡Compra Realizada con Éxito! 🎉</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setOrdenExitosa(null)}
                ></button>
              </div>
              <div className="modal-body text-center py-4">
                <h4>¡Gracias por tu compra en PokeStore!</h4>
                <p className="text-muted">
                  Tu pedido ha sido procesado exitosamente. Recibirás los detalles de despacho en
                  tu correo electrónico.
                </p>
                <div className="alert alert-light border text-start small">
                  <strong>Número de orden:</strong> #PK-{ordenExitosa.id}
                  <br />
                  <strong>Total pagado:</strong>{' '}
                  <span className="fw-bold text-success">{ordenExitosa.monto}</span>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="/"
                  className="btn btn-primary w-100 fw-bold"
                  onClick={() => setOrdenExitosa(null)}
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}