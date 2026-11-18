import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPedidos, modificarUsuario } from '../services/api';
import { regiones } from '../utils/regiones';
import './Perfil.css';

const REGEX_TELEFONO = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;

// Valores que el backend guarda cuando la cuenta se creó con Google y aún no hay datos de despacho.
const MARCADORES_VACIO = ['sin dirección', 'sin región', 'sin comuna', 'no registrado'];

const estaVacio = (valor) => {
  const texto = (valor ?? '').trim().toLowerCase();
  return texto === '' || MARCADORES_VACIO.includes(texto);
};

// Nivel de entrenador: cada producto comprado suma XP.
const XP_POR_PRODUCTO = 100;
const NIVELES = [
  { nombre: 'Aspirante', desde: 0, hasta: 2000 },
  { nombre: 'Entrenador', desde: 2000, hasta: 5000 },
  { nombre: 'Maestro Pokémon', desde: 5000, hasta: null },
];

const calcularNivel = (xp) => {
  const nivel = NIVELES.find((n) => n.hasta === null || xp < n.hasta);
  const progreso =
    nivel.hasta === null ? 100 : Math.round(((xp - nivel.desde) / (nivel.hasta - nivel.desde)) * 100);
  return { ...nivel, progreso };
};

const desdeUsuario = (usuario) => ({
  nombre: usuario?.nombre ?? '',
  telefono: usuario?.telefono ?? '',
  direccion: usuario?.direccion ?? '',
  region: usuario?.region ?? '',
  comuna: usuario?.comuna ?? '',
});

// ---------- Íconos ----------
const IconoPokebola = () => (
  <svg viewBox="0 0 24 24" width="22" height="22">
    <circle cx="12" cy="12" r="10" fill="#fff" stroke="#2b3a67" strokeWidth="1.6" />
    <path d="M2 12a10 10 0 0 1 20 0z" fill="#e5383b" stroke="#2b3a67" strokeWidth="1.6" />
    <path d="M2 12h20" stroke="#2b3a67" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3.2" fill="#fff" stroke="#2b3a67" strokeWidth="1.6" />
  </svg>
);

const IconoCorreo = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2b3a67" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2.5" fill="#2b3a67" />
    <path d="m4 7.5 8 6 8-6" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconoTelefono = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="#2b3a67">
    <path d="M6.6 3.5 9 3a1.5 1.5 0 0 1 1.7 1l.9 2.6a1.5 1.5 0 0 1-.4 1.6L9.9 9.3a12 12 0 0 0 4.8 4.8l1.1-1.3a1.5 1.5 0 0 1 1.6-.4l2.6.9a1.5 1.5 0 0 1 1 1.7l-.5 2.4a2 2 0 0 1-2 1.6A16.5 16.5 0 0 1 4.9 5.5a2 2 0 0 1 1.7-2z" />
  </svg>
);

const IconoUbicacion = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="#2b3a67">
    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const IconoLapiz = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
  </svg>
);

const CAMPOS = [
  { id: 'nombre', etiqueta: 'Nombre', Icono: IconoPokebola, vacio: 'Sin nombre', editable: true },
  { id: 'email', etiqueta: 'Email', Icono: IconoCorreo, editable: false },
  { id: 'telefono', etiqueta: 'Teléfono', Icono: IconoTelefono, vacio: 'Sin teléfono', agregar: 'teléfono', editable: true },
  { id: 'direccion', etiqueta: 'Dirección', Icono: IconoUbicacion, vacio: 'Sin dirección', agregar: 'dirección', editable: true },
  { id: 'region', etiqueta: 'Región', Icono: IconoUbicacion, vacio: 'Sin región', agregar: 'región', editable: true },
  { id: 'comuna', etiqueta: 'Comuna', Icono: IconoUbicacion, vacio: 'Sin comuna', agregar: 'comuna', editable: true },
];

function Perfil() {
  const { user, logout, guardarSesion } = useAuth();
  const navigate = useNavigate();

  const [datos, setDatos] = useState(() => desdeUsuario(user));
  const [editando, setEditando] = useState({});
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [aviso, setAviso] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [xp, setXp] = useState(0);

  // La XP sale de los pedidos del usuario (si el backend no responde, queda en 0).
  useEffect(() => {
    if (!user?.id) return undefined;
    let activo = true;
    getPedidos(user.id)
      .then((pedidos) => {
        if (!activo) return;
        const productos = pedidos.reduce(
          (total, pedido) => total + pedido.items.reduce((suma, item) => suma + item.cantidad, 0),
          0
        );
        setXp(productos * XP_POR_PRODUCTO);
      })
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, [user?.id]);

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

  const base = desdeUsuario(user);
  const hayCambios = Object.keys(base).some((k) => (datos[k] ?? '').trim() !== (base[k] ?? '').trim());
  const nivel = calcularNivel(xp);
  const etiquetaXp = nivel.hasta ? `${xp}/${nivel.hasta} XP` : `${xp} XP`;

  const regionValida = regiones.some((r) => r.nombre === datos.region);
  const comunas = regiones.find((r) => r.nombre === datos.region)?.comunas ?? [];

  const editar = (id) => setEditando((e) => ({ ...e, [id]: true }));

  const quitarError = (id) =>
    setErrores((e) => Object.fromEntries(Object.entries(e).filter(([clave]) => clave !== id)));

  const cambiar = (id, valor) => {
    setAviso('');
    quitarError(id);
    if (id === 'region') {
      // Al cambiar de región la comuna anterior deja de valer: se pide elegir otra.
      setDatos((d) => ({ ...d, region: valor, comuna: '' }));
      setEditando((e) => ({ ...e, comuna: true }));
    } else {
      setDatos((d) => ({ ...d, [id]: valor }));
    }
  };

  const cancelar = (id) => {
    const grupo = id === 'region' || id === 'comuna' ? ['region', 'comuna'] : [id];
    setDatos((d) => ({ ...d, ...Object.fromEntries(grupo.map((k) => [k, base[k]])) }));
    setEditando((e) => Object.fromEntries(Object.entries(e).filter(([k]) => !grupo.includes(k))));
    setErrores((e) => Object.fromEntries(Object.entries(e).filter(([k]) => !grupo.includes(k))));
  };

  const validar = () => {
    const nuevos = {};
    if (datos.nombre.trim() === '') nuevos.nombre = 'El nombre es obligatorio';
    const telefono = datos.telefono.trim();
    if (telefono !== '' && !REGEX_TELEFONO.test(telefono)) {
      nuevos.telefono = 'Ingresa un celular válido, ej: +56 9 1234 5678';
    }
    if (datos.direccion.trim().length < 5) nuevos.direccion = 'Ingresa tu dirección (calle y número)';
    if (datos.region.trim() === '') nuevos.region = 'Selecciona tu región';
    if (datos.comuna.trim() === '') nuevos.comuna = 'Selecciona tu comuna';
    return nuevos;
  };

  const guardar = async () => {
    setAviso('');
    setErrorGeneral('');

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      // Abre los campos con error para que se vea qué corregir.
      setEditando((e) => ({ ...e, ...Object.fromEntries(Object.keys(nuevos).map((k) => [k, true])) }));
      return;
    }
    if (!user.id) {
      setErrorGeneral('No se pudo identificar tu cuenta. Vuelve a iniciar sesión.');
      return;
    }

    setGuardando(true);
    try {
      const actualizado = await modificarUsuario(user.id, {
        nombre: datos.nombre.trim(),
        email: user.email,
        telefono: datos.telefono.trim() || null,
        direccion: datos.direccion.trim(),
        region: datos.region,
        comuna: datos.comuna,
        rol: user.rol ?? 'cliente',
      });
      guardarSesion({ ...user, ...actualizado });
      setDatos(desdeUsuario(actualizado));
      setEditando({});
      setAviso('¡Cambios guardados!');
    } catch (err) {
      setErrorGeneral(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const renderControl = ({ id, etiqueta }) => {
    const idControl = `perfil-${id}`;

    if (id === 'region') {
      return (
        <select
          id={idControl}
          className="perfil-control"
          value={regionValida ? datos.region : ''}
          onChange={(e) => cambiar('region', e.target.value)}
          autoFocus
        >
          <option value="">Selecciona región</option>
          {regiones.map((r) => (
            <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
          ))}
        </select>
      );
    }

    if (id === 'comuna') {
      return (
        <select
          id={idControl}
          className="perfil-control"
          value={comunas.includes(datos.comuna) ? datos.comuna : ''}
          onChange={(e) => cambiar('comuna', e.target.value)}
          disabled={!regionValida}
        >
          <option value="">{regionValida ? 'Selecciona comuna' : 'Elige primero la región'}</option>
          {comunas.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={idControl}
        className="perfil-control"
        type={id === 'telefono' ? 'tel' : 'text'}
        placeholder={id === 'telefono' ? '+56 9 1234 5678' : etiqueta}
        value={datos[id]}
        onChange={(e) => cambiar(id, e.target.value)}
        autoFocus
      />
    );
  };

  const renderCampo = (campo) => {
    const { id, etiqueta, Icono, vacio, agregar, editable } = campo;
    const valor = id === 'email' ? user.email : datos[id];
    const abierto = Boolean(editando[id]);
    const sinDato = editable && estaVacio(valor);
    const error = errores[id];

    let accion = null;
    if (editable && abierto) {
      accion = (
        <button type="button" className="perfil-btn-icono" aria-label={`Cancelar ${etiqueta.toLowerCase()}`} onClick={() => cancelar(id)}>
          ✕
        </button>
      );
    } else if (editable && sinDato) {
      accion = (
        <button type="button" className="perfil-btn-agregar" onClick={() => editar(id)}>
          + Agregar {agregar ?? etiqueta.toLowerCase()}
        </button>
      );
    } else if (editable) {
      accion = (
        <button type="button" className="perfil-btn-icono" aria-label={`Editar ${etiqueta.toLowerCase()}`} onClick={() => editar(id)}>
          <IconoLapiz />
        </button>
      );
    }

    return (
      <div className={`perfil-campo${error ? ' perfil-campo--error' : ''}`} key={id}>
        <span className="perfil-campo__icono" aria-hidden="true"><Icono /></span>
        <div className="perfil-campo__cuerpo">
          {abierto ? (
            <label className="perfil-campo__etiqueta" htmlFor={`perfil-${id}`}>{etiqueta}</label>
          ) : (
            <span className="perfil-campo__etiqueta">{etiqueta}</span>
          )}
          {abierto ? (
            renderControl(campo)
          ) : (
            <span className={`perfil-campo__valor${sinDato ? ' perfil-campo__valor--vacio' : ''}`}>
              {sinDato ? vacio : valor}
            </span>
          )}
          {error && <span className="perfil-campo__error" role="alert">{error}</span>}
        </div>
        {accion}
      </div>
    );
  };

  return (
    <div className="perfil-fondo">
      <div className="container">
        <div className="perfil-tarjeta">
          <div className="perfil-cabecera">
            <div className="perfil-avatar">
              <img src="/assets/img/nosotros/entrenador.webp" alt="Avatar de entrenador" />
            </div>

            <div className="perfil-cabecera__texto">
              <h1 className="perfil-saludo">¡Hola, {base.nombre}!</h1>
              <div className="perfil-nivel">
                <span>Nivel de Entrenador: {nivel.nombre}</span>
                <span>{etiquetaXp}</span>
              </div>
              <div
                className="perfil-barra"
                role="progressbar"
                aria-label="Progreso de nivel"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={nivel.progreso}
              >
                <div className="perfil-barra__relleno" style={{ width: `${nivel.progreso}%` }} />
              </div>
            </div>
          </div>

          <div className="perfil-campos">{CAMPOS.map(renderCampo)}</div>

          {(aviso || errorGeneral) && (
            <p
              className={`perfil-mensaje ${errorGeneral ? 'perfil-mensaje--error' : 'perfil-mensaje--ok'}`}
              role={errorGeneral ? 'alert' : 'status'}
            >
              {errorGeneral || aviso}
            </p>
          )}

          <div className="perfil-acciones">
            <button
              type="button"
              className="perfil-btn-guardar"
              onClick={guardar}
              disabled={!hayCambios || guardando}
            >
              {guardando ? 'Guardando…' : 'Guardar Cambios'}
            </button>
            <button type="button" className="perfil-btn-salir" onClick={cerrarSesion}>
              Cerrar Sesión
            </button>
          </div>
        </div>

        {user.rol === 'admin' && (
          <p className="text-secondary small text-center mt-4 mb-0">
            Eres administrador: abre el panel con el botón ☰ Admin de la barra superior.
          </p>
        )}
      </div>
    </div>
  );
}

export default Perfil;
