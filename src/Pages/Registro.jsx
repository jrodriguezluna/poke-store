import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { regiones } from '../utils/regiones';

const inicial = {
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  region: '',
  comuna: '',
  password: '',
  confirmar: '',
};

function Registro() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  const comunas = regiones.find((r) => r.nombre === datos.region)?.comunas ?? [];

  const manejarCambio = (e) => {
    const { id, value } = e.target;
    if (id === 'region') {
    
      setDatos({ ...datos, region: value, comuna: '' });
    } else {
      setDatos({ ...datos, [id]: value });
    }
  };

  const validar = () => {
    const nuevos = {};
    if (datos.nombre.trim() === '') {
      nuevos.nombre = 'El nombre es obligatorio';
    }
    if (!/^\S+@\S+\.\S+$/.test(datos.email)) {
      nuevos.email = 'Email inválido';
    }
    
    if (datos.telefono.trim() !== '' && !/^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/.test(datos.telefono.trim())) {
      nuevos.telefono = 'Ingresa un celular válido, ej: +56 9 1234 5678';
    }
    if (datos.direccion.trim().length < 5) {
      nuevos.direccion = 'Ingresa tu dirección (calle y número)';
    }
    if (datos.region === '') {
      nuevos.region = 'Selecciona tu región';
    }
    if (datos.comuna === '') {
      nuevos.comuna = 'Selecciona tu comuna';
    }
    if (datos.password.length < 6) {
      nuevos.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (datos.confirmar !== datos.password) {
      nuevos.confirmar = 'Las contraseñas no coinciden';
    }
    return nuevos;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    setErrorGeneral('');

    if (Object.keys(nuevos).length === 0) {
      const resultado = register(datos);
      if (!resultado.ok) {
        setErrorGeneral(resultado.error);
        return;
      }
      console.log('[LOG][Registro] Usuario guardado:', datos.email);
      navigate('/login');
    }
  };

  const clase = (id, base = 'form-control') => base + (errores[id] ? ' is-invalid' : '');

  const campo = (id, etiqueta, tipo = 'text', placeholder = '', columnas = 'col-12') => (
    <div className={columnas}>
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      <input
        id={id}
        type={tipo}
        className={clase(id)}
        value={datos[id]}
        onChange={manejarCambio}
        placeholder={placeholder}
      />
      {errores[id] && <div className="invalid-feedback">{errores[id]}</div>}
    </div>
  );

  const selector = (id, etiqueta, opciones, columnas = 'col-12', deshabilitado = false) => (
    <div className={columnas}>
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      <select
        id={id}
        className={clase(id, 'form-select')}
        value={datos[id]}
        onChange={manejarCambio}
        disabled={deshabilitado}
      >
        <option value="">Selecciona...</option>
        {opciones.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {errores[id] && <div className="invalid-feedback">{errores[id]}</div>}
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="h3 mb-4 text-center">Crear cuenta</h1>

          <form onSubmit={manejarEnvio} noValidate>
            <div className="row g-3">
              {campo('nombre', 'Nombre', 'text', 'Ash Ketchum')}
              {campo('email', 'Email', 'email', 'ash@pokestore.cl', 'col-12 col-md-6')}
              {campo('telefono', 'Teléfono (opcional)', 'tel', '+56 9 1234 5678', 'col-12 col-md-6')}
              {campo('direccion', 'Dirección', 'text', 'Av. Siempre Viva 742, depto 21')}
              {selector('region', 'Región', regiones.map((r) => r.nombre), 'col-12 col-md-6')}
              {selector('comuna', 'Comuna', comunas, 'col-12 col-md-6', datos.region === '')}
              {campo('password', 'Contraseña', 'password', '', 'col-12 col-md-6')}
              {campo('confirmar', 'Confirmar contraseña', 'password', '', 'col-12 col-md-6')}
            </div>

            {errorGeneral && <div className="alert alert-danger mt-3 mb-0">{errorGeneral}</div>}

            <button type="submit" className="btn btn-danger w-100 mt-4">Crear cuenta</button>
          </form>

          <p className="text-center small mt-4 mb-0">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registro;