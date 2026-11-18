import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getProductos } from '../services/api';
import { PRODUCTOS_MOCK } from '../data/productos';

const ProductosContext = createContext(null);

export function ProductosProvider({ children }) {

  const [productos, setProductos] = useState(PRODUCTOS_MOCK);
  const [cargando, setCargando] = useState(true); 
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    try {
      setProductos(await getProductos());
      setError('');
    } catch (e) {
      setError(e.message);
      console.warn('[Productos] API no disponible, mostrando datos locales.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return (
    <ProductosContext.Provider value={{ productos, cargando, error, recargar }}>
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  return useContext(ProductosContext);
}
