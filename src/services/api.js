const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
// Si usas Create React App: process.env.REACT_APP_API_URL

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // FastAPI devuelve los errores en { "detail": "..." }
    throw new Error(err.detail || err.error || 'Error en la petición');
  }

  if (res.status === 204) return null;
  return res.json();
}

// ---------- Usuarios / Auth ----------
export const registrarUsuario = (datos) =>
  request("/api/registro", { method: "POST", body: JSON.stringify(datos) });

export const login = (datos) =>
  request("/api/login", { method: "POST", body: JSON.stringify(datos) });

export const listarUsuarios = () => request("/api/usuarios");

export const modificarUsuario = (id, datos) =>
  request(`/api/usuarios/${id}`, { method: "PUT", body: JSON.stringify(datos) });

export const eliminarUsuario = (id) =>
  request(`/api/usuarios/${id}`, { method: "DELETE" });

export const loginGoogle = (credential) =>
  request("/api/auth/google", { method: "POST", body: JSON.stringify({ credential }) });

// ---------- Blogs ----------
export const listarBlogs = () => request("/api/blogs");

export const obtenerBlog = (id) => request(`/api/blogs/${id}`);

export const crearBlog = (datos) =>
  request("/api/blogs", { method: "POST", body: JSON.stringify(datos) });

export const actualizarBlog = (id, datos) =>
  request(`/api/blogs/${id}`, { method: "PUT", body: JSON.stringify(datos) });

export const eliminarBlog = (id) =>
  request(`/api/blogs/${id}`, { method: "DELETE" });

// ---------- Productos ----------
export const getProductos = () => request("/api/productos");

export const getProducto = (id) => request(`/api/productos/${id}`);

export const crearProducto = (datos) =>
  request("/api/productos", { method: "POST", body: JSON.stringify(datos) });

export const actualizarProducto = (id, datos) =>
  request(`/api/productos/${id}`, { method: "PUT", body: JSON.stringify(datos) });

export const eliminarProducto = (id) =>
  request(`/api/productos/${id}`, { method: "DELETE" });

// ---------- Pedidos ----------
export const getPedidos = (usuarioId) =>
  request(`/api/pedidos${usuarioId == null ? '' : `?usuarioId=${usuarioId}`}`);

export const getPedido = (id) => request(`/api/pedidos/${id}`);

export const crearPedido = (datos) =>
  request("/api/pedidos", { method: "POST", body: JSON.stringify(datos) });

// ---------- Contacto ----------
export const enviarContacto = (datos) =>
  request("/api/contacto", { method: "POST", body: JSON.stringify(datos) });