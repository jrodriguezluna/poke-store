const CARRITO_KEY = 'poke_carrito';

export function leerCarrito() {
  try {
    const items = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function guardarCarrito(items) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
}

export function agregarProductoCarrito(producto, cantidad) {
  const items = leerCarrito();
  const existente = items.find((item) => item.id === producto.id);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    items.push({ ...producto, cantidad });
  }

  guardarCarrito(items);
}