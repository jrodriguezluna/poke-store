import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h3 mb-3">Mi perfil</h1>
        <p className="text-secondary">Debes iniciar sesión para ver tu perfil.</p>
        <Link to="/login" className="btn btn-danger">Ir a iniciar sesión</Link>
      </div>
    );
  }

  const datos = [
    { etiqueta: 'Nombre', valor: user.nombre },
    { etiqueta: 'Email', valor: user.email },
    { etiqueta: 'Teléfono', valor: user.telefono || 'No registrado' },
    { etiqueta: 'Dirección', valor: user.direccion },
    { etiqueta: 'Región', valor: user.region || '-' },
    { etiqueta: 'Comuna', valor: user.comuna },
  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="h3 mb-4 text-center">Mi perfil</h1>

          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">Hola, {user.nombre}</h2>

              <dl className="row mb-0">
                {datos.map(({ etiqueta, valor }) => (
                  <div className="row mb-2 mx-0 px-0" key={etiqueta}>
                    <dt className="col-4 text-secondary fw-normal">{etiqueta}</dt>
                    <dd className="col-8 mb-0">{valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <button type="button" className="btn btn-outline-danger w-100 mt-4" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;