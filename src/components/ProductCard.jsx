import { Link } from 'react-router-dom';
import { esStockBajo } from '../utils/stock';

export default function ProductCard({ producto, nombre, precio, imagen, categoria, id, onAdd }) {
  // Soporta recibir el objeto producto completo o props individuales
  const itemNombre = producto?.nombre || nombre || 'Producto sin nombre';
  const itemPrecio = producto?.precio ?? precio ?? 0;
  const itemImagen = producto?.imagen || imagen || 'https://via.placeholder.com/150';
  const itemCategoria = producto?.categoria || categoria;
  const itemId = producto?.id || id;
  const stockAgotado = producto?.stock === 0;
  const stockBajo = esStockBajo(producto?.stock);

  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(itemPrecio);

  return (
    <div className="card h-100 shadow-sm border-0">
      {itemImagen && (
        <img
          src={itemImagen}
          className="card-img-top p-3 object-fit-contain"
          alt={itemNombre}
          style={{ height: '180px' }}
        />
      )}
      <div className="card-body d-flex flex-column">
        {itemCategoria && (
          <span className="badge bg-secondary mb-2 align-self-start">{itemCategoria}</span>
        )}
        {stockAgotado && (
          <span className="badge bg-danger mb-2 align-self-start" role="status">
            Agotado
          </span>
        )}
        {!stockAgotado && stockBajo && (
          <span className="badge bg-warning text-dark mb-2 align-self-start" role="status">
            ¡Pocas unidades!
          </span>
        )}
        <h5 className="card-title h6 fw-bold">{itemNombre}</h5>
        <p className="card-text fw-semibold text-danger fs-5 mt-auto mb-3">
          {precioFormateado}
        </p>

        <div className="d-flex gap-2">
          {onAdd && (
            <button className="btn btn-primary btn-sm flex-grow-1" onClick={onAdd}>
              Agregar
            </button>
          )}
          {itemId && (
            <Link to={`/producto/${itemId}`} className="btn btn-outline-dark btn-sm">
              Ver Detalle
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
