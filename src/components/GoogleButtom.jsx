import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginGoogle } from '../services/api';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function BotonGoogleInterno({ onError }) {
  const navigate = useNavigate();
  const { guardarSesion } = useAuth();

  const manejarExito = async (respuesta) => {
    try {
      const data = await loginGoogle(respuesta.credential);
      guardarSesion(data);
      navigate('/');
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center my-3">
        <hr className="flex-grow-1" />
        <span className="px-2 small text-muted">o</span>
        <hr className="flex-grow-1" />
      </div>
      <div className="d-flex justify-content-center">
        <GoogleLogin
          onSuccess={manejarExito}
          onError={() => onError('Error al conectar con Google')}
          text="continue_with"
        />
      </div>
    </>
  );
}

// Si no hay client id (por ejemplo en los tests) no se muestra nada
export default function BotonGoogle(props) {
  if (!CLIENT_ID) return null;
  return <BotonGoogleInterno {...props} />;
}