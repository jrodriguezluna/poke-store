import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProductos, crearProducto, actualizarProducto, eliminarProducto } from "../services/api";

const VACIO = { nombre: "", tipo: "", categoria: "", precio: 0, stock: 0, imagen: "", descripcion: "" };

const CAMPOS = [
  { name: "nombre", placeholder: "nombre", obligatorio: true },
  { name: "tipo", placeholder: "tipo (ej: fuego)" },
  { name: "categoria", placeholder: "categoria (ej: Peluches)" },
  { name: "precio", placeholder: "precio", type: "number", obligatorio: true },
  { name: "stock", placeholder: "stock", type: "number", obligatorio: true },
  { name: "imagen", placeholder: "URL de la imagen", type: "url" },
];

export default function AdminProductos() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");

  const cargar = () => getProductos().then(setProductos).catch((e) => setError(e.message));
  useEffect(() => { cargar(); }, []);

  if (user?.rol !== "admin") return <Navigate to="/" replace />;

  const onChange = (e) => setEditando({ ...editando, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    const datos = {
      ...editando,
      tipo: editando.tipo || null,
      categoria: editando.categoria || null,
      precio: Number(editando.precio),
      stock: Number(editando.stock),
      imagen: editando.imagen || null,
      descripcion: editando.descripcion || null,
    };
    try {
      if (editando.id) await actualizarProducto(editando.id, datos);
      else await crearProducto(datos);
      setEditando(null);
      cargar();
    } catch (err) { setError(err.message); }
  };

  const borrar = async (p) => {
    if (!window.confirm(`¿Eliminar ${p.nombre}?`)) return;
    setError("");
    try { await eliminarProducto(p.id); cargar(); }
    catch (err) { setError(err.message); }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Productos</h2>
        {!editando && (
          <button className="btn btn-danger" onClick={() => { setError(""); setEditando({ ...VACIO }); }}>
            Agregar producto
          </button>
        )}
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      {editando && (
        <form onSubmit={guardar} className="row g-2 mb-4">
          {CAMPOS.map(({ name, placeholder, type = "text", obligatorio }) => (
            <div className="col-md-4" key={name}>
              <input className="form-control" type={type} name={name} placeholder={placeholder}
                     min={type === "number" ? 0 : undefined}
                     value={editando[name] ?? ""} onChange={onChange} required={obligatorio} />
            </div>
          ))}
          <div className="col-md-8">
            <textarea className="form-control" name="descripcion" placeholder="descripcion" rows={2}
                      value={editando["descripcion"] ?? ""} onChange={onChange} />
          </div>
          <div className="col-md-4 d-flex gap-2 align-items-start">
            <button className="btn btn-primary">{editando["id"] ? "Guardar" : "Crear"}</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setEditando(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <table className="table table-striped align-middle">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.nombre}</td><td>{p.categoria}</td>
              <td>${p.precio.toLocaleString("es-CL")}</td><td>{p.stock}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => { setError(""); setEditando(p); }}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => borrar(p)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
