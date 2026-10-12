import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTOS_MOCK } from '../data/productos';

export default function Checkout() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    direccion: '',
    ciudad: 'Santiago',
    metodoPago: 'webpay',
  });

  const [ordenCompletada, setOrdenCompletada] = useState(null);

  // Datos simulados de la orden a pagar
  const itemsOrden = [
    { ...PRODUCTOS_MOCK[0], cantidad: 2 }, // Pikachu x2
    { ...PRODUCTOS_MOCK[1], cantidad: 1 }, // Charizard x1
  ];

  const total = itemsOrden.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(total);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numeroOrden = Math.floor(100000 + Math.random() * 900000);
    setOrdenCompletada({
      ordenId: numeroOrden,
      destinatario: formData.nombre || 'Entrenador Pokémon',
      email: formData.email,
      direccion: formData.direccion,
      total: totalFormateado,
    });
  };

  if (ordenCompletada) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-4 p-md-5 mx-auto" style={{ maxWidth: '650px' }}>
          <div className="text-success mb-3 fs-1">✅</div>
          <h2 className="fw-bold mb-2">¡Gracias por tu compra!</h2>
          <p className="text-muted mb-4">
            Tu pedido ha sido registrado con éxito. Hemos enviado el comprobante a{' '}
            <strong>{ordenCompletada.email || 'tu correo registrado'}</strong>.
          </p>

          <div className="alert alert-light border text-start p-3 mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Número de Pedido:</span>
              <strong className="text-dark">#PK-{ordenCompletada.ordenId}</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Destinatario:</span>
              <span>{ordenCompletada.destinatario}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Dirección de Envío:</span>
              <span>{ordenCompletada.direccion || 'Despacho a domicilio'}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <strong className="text-muted">Total Pagado:</strong>
              <strong className="text-success fs-5">{ordenCompletada.total}</strong>
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-center">
            <Link to="/catalogo" className="btn btn-primary fw-bold px-4">
              Seguir Comprando
            </Link>
            <Link to="/" className="btn btn-outline-secondary px-4">
              Ir al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Finalizar Compra (Checkout)</h2>

      <div className="row g-4">
        {/* Columna Izquierda: Formulario de Despacho y Pago */}
        <div className="col-lg-7">
          <form onSubmit={handleSubmit} className="card shadow-sm border-0 p-4 mb-4">
            <h5 className="fw-bold mb-3">1. Datos de Despacho</h5>

            <div className="mb-3">
              <label htmlFor="input-nombre" className="form-label small fw-semibold">
                Nombre Completo:
              </label>
              <input
                type="text"
                id="input-nombre"
                name="nombre"
                className="form-control"
                placeholder="Ej: Ash Ketchum"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="input-email" className="form-label small fw-semibold">
                Correo Electrónico:
              </label>
              <input
                type="email"
                id="input-email"
                name="email"
                className="form-control"
                placeholder="ejemplo@correo.cl"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-8">
                <label htmlFor="input-direccion" className="form-label small fw-semibold">
                  Dirección de Entrega:
                </label>
                <input
                  type="text"
                  id="input-direccion"
                  name="direccion"
                  className="form-control"
                  placeholder="Calle, número, depto"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="select-ciudad" className="form-label small fw-semibold">
                  Ciudad:
                </label>
                <select
                  id="select-ciudad"
                  name="ciudad"
                  className="form-select"
                  value={formData.ciudad}
                  onChange={handleChange}
                >
                  <option value="Santiago">Santiago</option>
                  <option value="Valparaíso">Valparaíso</option>
                  <option value="Concepción">Concepción</option>
                  <option value="Pueblo Paleta">Pueblo Paleta</option>
                </select>
              </div>
            </div>

            <hr className="my-4" />

            <h5 className="fw-bold mb-3">2. Método de Pago</h5>
            <div className="mb-4">
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="metodoPago"
                  id="pago-webpay"
                  value="webpay"
                  checked={formData.metodoPago === 'webpay'}
                  onChange={handleChange}
                />
                <label className="form-check-label fw-semibold" htmlFor="pago-webpay">
                  💳 Webpay Plus (Débito / Crédito)
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="metodoPago"
                  id="pago-transferencia"
                  value="transferencia"
                  checked={formData.metodoPago === 'transferencia'}
                  onChange={handleChange}
                />
                <label className="form-check-label fw-semibold" htmlFor="pago-transferencia">
                  🏦 Transferencia Bancaria Electrónica
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-success btn-lg fw-bold w-100 py-3 shadow-sm">
              Confirmar y Pagar {totalFormateado}
            </button>
          </form>
        </div>

        {/* Columna Derecha: Resumen del Pedido */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '85px' }}>
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-3">Resumen de la Orden</h5>

              <div className="d-flex flex-column gap-3 mb-3">
                {itemsOrden.map((item) => (
                  <div key={item.id} className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                      />
                      <div>
                        <div className="small fw-bold">{item.nombre}</div>
                        <div className="text-muted small">Cantidad: {item.cantidad}</div>
                      </div>
                    </div>
                    <span className="small fw-semibold">
                      ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                    </span>
                  </div>
                ))}
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Costo de Envío:</span>
                <span className="text-success fw-bold">Gratis</span>
              </div>

              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <span className="fs-5 fw-bold">TOTAL:</span>
                <span className="fw-bold fs-3 text-success">{totalFormateado}</span>
              </div>

              <Link to="/carrito" className="btn btn-outline-secondary w-100 btn-sm">
                ← Modificar Carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}