import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';
import BotonGoogle from '../components/GoogleButtom';

function Login() {
  const navigate = useNavigate();
  const { guardarSesion } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const validar = () => {
    const nuevos = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nuevos.email = 'Email inválido';
    }
    if (password.length < 6) {
      nuevos.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    return nuevos;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    setErrorGeneral('');

    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    try {
      const data = await loginApi({ email, password });
      guardarSesion(data);
      console.log('[LOG][Login] Sesión iniciada:', email);
      navigate('/');
    } catch (err) {
      setErrorGeneral(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div
        className="card shadow-lg border-0 rounded-4 p-4 p-md-5 w-100"
        style={{ maxWidth: '420px' }}
      >
        <h1 className="h3 mb-4 text-center">Iniciar sesión</h1>

        <form onSubmit={manejarEnvio} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className={'form-control' + (errores.email ? ' is-invalid' : '')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ash@pokestore.cl"
            />
            {errores.email && <div className="invalid-feedback">{errores.email}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              id="password"
              type="password"
              className={'form-control' + (errores.password ? ' is-invalid' : '')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errores.password && <div className="invalid-feedback">{errores.password}</div>}
          </div>

          {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

          <button type="submit" className="btn btn-danger w-100 rounded-3" disabled={enviando}>
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <BotonGoogle onError={setErrorGeneral} />

        <p className="text-center small mt-4 mb-0">
          ¿No tienes cuenta? <Link to="/registro">Crea una cuenta</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;