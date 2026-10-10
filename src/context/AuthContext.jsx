import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const USUARIOS_KEY = 'poke_usuarios';
const SESION_KEY = 'poke_sesion';

const ADMIN = {
  nombre: 'Administrador',
  email: 'admin@pokestore.cl',
  password: 'admin123',
  rol: 'admin',
};

const leer = (clave, defecto) => {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : defecto;
  } catch {
    return defecto;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => leer(SESION_KEY, null));

  const iniciarSesion = (usuario) => {
    const { password: _omitida, ...sesion } = usuario; 
    localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
    setUser(sesion);
  };

  const register = (datos) => {
    const usuarios = leer(USUARIOS_KEY, []);
    const email = datos.email.trim().toLowerCase();

    if (email === ADMIN.email || usuarios.some((u) => u.email === email)) {
      return { ok: false, error: 'Ya existe una cuenta con ese email' };
    }

    const { confirmar, ...resto } = datos; 
    usuarios.push({ ...resto, email, rol: 'cliente' });
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
    return { ok: true };
  };

  const login = (email, password) => {
    const correo = email.trim().toLowerCase();


    if (correo === ADMIN.email && password === ADMIN.password) {
      iniciarSesion(ADMIN);
      return { ok: true };
    }

    const usuarios = leer(USUARIOS_KEY, []);
    const encontrado = usuarios.find((u) => u.email === correo && u.password === password);

    if (!encontrado) {
      return { ok: false, error: 'Email o contraseña incorrectos' };
    }

    iniciarSesion(encontrado);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESION_KEY);
    setUser(null);
  };

  const esAdmin = user?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ user, esAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}