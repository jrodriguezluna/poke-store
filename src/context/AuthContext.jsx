import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const USUARIOS_KEY = 'poke_usuarios';
const SESION_KEY = 'poke_sesion';

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

  const register = (datos) => {
    const usuarios = leer(USUARIOS_KEY, []);
    const email = datos.email.trim().toLowerCase();

    if (usuarios.some((u) => u.email === email)) {
      return { ok: false, error: 'Ya existe una cuenta con ese email' };
    }

    const { confirmar, ...resto } = datos;
    usuarios.push({ ...resto, email });
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
    return { ok: true };
  };

  const login = (email, password) => {
    const usuarios = leer(USUARIOS_KEY, []);
    const encontrado = usuarios.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );

    if (!encontrado) {
      return { ok: false, error: 'Email o contraseña incorrectos' };
    }

    const { password: _omitida, ...sesion } = encontrado; 
    localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
    setUser(sesion);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}