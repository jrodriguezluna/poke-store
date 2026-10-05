export default function ProductCard({ nombre, precio, onAdd }) {
  return (
    <div className="card p-3">
      <h5>{nombre}</h5>
      <p>${precio}</p>
      <button className="btn btn-primary" onClick={onAdd}>Agregar</button>
    </div>
  );
}
