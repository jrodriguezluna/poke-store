import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listarUsuarios, modificarUsuario, eliminarUsuario } from "../services/api";

export default function AdminUsuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null); // usuario en edición o null
  const [error, setError] = useState("");

  const cargar = () => listarUsuarios().then(setUsuarios).catch((e) => setError(e.message));
  useEffect(() => { cargar(); }, []);

  // Los hooks van arriba; el bloqueo va después
  if (user?.rol !== "admin") return <Navigate to="/" replace />;

  const onChange = (e) => setEditando({ ...editando, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await modificarUsuario(editando.id, {
        ...editando,
        telefono: editando.telefono || null,
        password: editando.password || null,
      });
      setEditando(null);
      cargar();
    } catch (err) { setError(err.message); }
  };

  const borrar = async (u) => {
    if (!window.confirm(`¿Eliminar a ${u.nombre}?`)) return;
    setError("");
    try { await eliminarUsuario(u.id); cargar(); }
    catch (err) { setError(err.message); }
  };

  return (
    <div className="container my-4">
      <h2>Usuarios</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {editando && (
        <form onSubmit={guardar} className="row g-2 mb-4">
          {["nombre", "email", "telefono", "direccion", "region", "comuna"].map((c) => (
            <div className="col-md-4" key={c}>
              <input className="form-control" name={c} placeholder={c}
                     value={editando[c] ?? ""} onChange={onChange}
                     required={c !== "telefono"} />
            </div>
          ))}
          <div className="col-md-4">
            <select className="form-select" name="rol" value={editando.rol} onChange={onChange}>
              <option value="cliente">cliente</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="col-md-4">
            <input className="form-control" type="password" name="password"
                   placeholder="Nueva contraseña (opcional)"
                   value={editando.password ?? ""} onChange={onChange} />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button className="btn btn-primary">Guardar</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setEditando(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <table className="table table-striped">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th></th></tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td><td>{u.nombre}</td><td>{u.email}</td><td>{u.rol}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setEditando(u)}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => borrar(u)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}