import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { getPedido, getPedidos } from '../services/api';

const formatoPrecio = (valor) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);

const formatoFecha = (fecha) => new Date(fecha).toLocaleString('es-CL');

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [error, setError] = useState('');
  const [errorDetalle, setErrorDetalle] = useState('');

  useEffect(() => {
    getPedidos()
      .then(setOrdenes)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  const abrirDetalle = async (id) => {
    setCargandoDetalle(true);
    setErrorDetalle('');
    setOrdenSeleccionada(null);
    try {
      setOrdenSeleccionada(await getPedido(id));
    } catch (err) {
      setErrorDetalle(err.message);
    } finally {
      setCargandoDetalle(false);
    }
  };

  return (
    <div className="container">
      <h1 className="h3 fw-bold mb-4">Órdenes</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {cargando && <p role="status">Cargando órdenes...</p>}
      {!cargando && !error && ordenes.length === 0 && (
        <p className="text-secondary">Aún no hay órdenes registradas.</p>
      )}

      {ordenes.length > 0 && (
        <ListGroup>
          {ordenes.map((orden) => (
            <ListGroup.Item
              key={orden.id}
              className="d-flex justify-content-between align-items-center gap-3"
            >
              <div>
                <div className="fw-semibold">Orden #PK-{orden.id}</div>
                <div className="small text-secondary">{formatoFecha(orden.fecha)}</div>
                <div>{formatoPrecio(orden.total)}</div>
              </div>
              <Button
                variant="outline-primary"
                onClick={() => abrirDetalle(orden.id)}
                aria-label={`Ver detalle orden ${orden.id}`}
              >
                Ver detalle
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {cargandoDetalle && <p className="mt-4" role="status">Cargando detalle...</p>}
      {errorDetalle && <Alert className="mt-4" variant="danger">{errorDetalle}</Alert>}
      {ordenSeleccionada && (
        <section className="card border-0 shadow-sm mt-4" aria-labelledby="detalle-orden">
          <div className="card-body">
            <h2 id="detalle-orden" className="h5 fw-bold">
              Detalle de orden #PK-{ordenSeleccionada.id}
            </h2>
            <p className="text-secondary">{formatoFecha(ordenSeleccionada.fecha)}</p>
            <ListGroup variant="flush">
              {ordenSeleccionada.items.map((item, index) => (
                <ListGroup.Item key={`${item.nombre}-${index}`} className="px-0">
                  <div className="d-flex justify-content-between gap-3">
                    <span>{item.nombre} × {item.cantidad}</span>
                    <span>{formatoPrecio(item.precioUnit * item.cantidad)}</span>
                  </div>
                  <small className="text-secondary">
                    Precio unitario: {formatoPrecio(item.precioUnit)}
                  </small>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <p className="fw-bold text-end mt-3 mb-0">
              Total: {formatoPrecio(ordenSeleccionada.total)}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
