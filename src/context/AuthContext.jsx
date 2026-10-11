import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const SESION_KEY = 'poke_sesion';
const TOKEN_KEY = 'token'; // misma clave que lee services/api.js

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

  // Recibe la respuesta de POST /api/login.
  // Acepta { usuario, token }, { user, access_token } o el usuario directo.
  const guardarSesion = (data) => {
    const usuario = data.usuario ?? data.user ?? data;
    const token = data.token ?? data.access_token;

    const { password: _omitida, ...sesion } = usuario;

    localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
    if (token) localStorage.setItem(TOKEN_KEY, token);
    setUser(sesion);
  };

  const logout = () => {
    localStorage.removeItem(SESION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const esAdmin = user?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ user, esAdmin, guardarSesion, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}