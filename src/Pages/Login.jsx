import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

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

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    setErrorGeneral('');

    if (Object.keys(nuevos).length === 0) {
      const resultado = login(email, password);
      if (!resultado.ok) {
        setErrorGeneral(resultado.error);
        return;
      }
      console.log('[LOG][Login] Sesión iniciada:', email);
      navigate('/');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">
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

            <button type="submit" className="btn btn-danger w-100">Ingresar</button>
          </form>

          <p className="text-center small mt-4 mb-0">
            ¿No tienes cuenta? <Link to="/registro">Crea una cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;