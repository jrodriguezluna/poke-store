import { useState } from 'react';

const inicial = {
  nombre: '',
  email: '',
  asunto: '',
  mensaje: '',
};

function Contacto({ onSubmit }) {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.id]: e.target.value });
    setEnviado(false);
  };

  const validar = () => {
    const nuevos = {};
    if (datos.nombre.trim() === '') {
      nuevos.nombre = 'El nombre es obligatorio';
    }
    if (!/^\S+@\S+\.\S+$/.test(datos.email)) {
      nuevos.email = 'Email inválido';
    }
    if (datos.asunto === '') {
      nuevos.asunto = 'Selecciona un asunto';
    }
    if (datos.mensaje.trim().length < 10) {
      nuevos.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }
    return nuevos;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);

    if (Object.keys(nuevos).length === 0) {
      console.log('[LOG][Contacto] Mensaje válido de:', datos.email);
      if (onSubmit) onSubmit(datos);
      setEnviado(true);
      setDatos(inicial);
    }
  };

  const clase = (id, base = 'form-control') => base + (errores[id] ? ' is-invalid' : '');

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="h3 mb-2 text-center">Contacto</h1>
          <p className="text-center text-secondary mb-4">
            ¿Tienes dudas sobre un pedido o un producto? Escríbenos y te responderemos pronto.
          </p>

          {enviado && (
            <div className="alert alert-success" role="alert">
              ¡Mensaje enviado! Te responderemos lo mas pronto posible.
            </div>
          )}

          <form onSubmit={manejarEnvio} noValidate>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  className={clase('nombre')}
                  value={datos.nombre}
                  onChange={manejarCambio}
                  placeholder="Ash Ketchum"
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  className={clase('email')}
                  value={datos.email}
                  onChange={manejarCambio}
                  placeholder="ash@pokestore.cl"
                />
                {errores.email && <div className="invalid-feedback">{errores.email}</div>}
              </div>

              <div className="col-12">
                <label htmlFor="asunto" className="form-label">Asunto</label>
                <select
                  id="asunto"
                  className={clase('asunto', 'form-select')}
                  value={datos.asunto}
                  onChange={manejarCambio}
                >
                  <option value="">Selecciona...</option>
                  <option value="Consulta sobre un producto">Consulta sobre un producto</option>
                  <option value="Estado de mi pedido">Estado de mi pedido</option>
                  <option value="Cambios y devoluciones">Cambios y devoluciones</option>
                  <option value="Otro">Otro</option>
                </select>
                {errores.asunto && <div className="invalid-feedback">{errores.asunto}</div>}
              </div>

              <div className="col-12">
                <label htmlFor="mensaje" className="form-label">Mensaje</label>
                <textarea
                  id="mensaje"
                  rows="5"
                  className={clase('mensaje')}
                  value={datos.mensaje}
                  onChange={manejarCambio}
                  placeholder="Cuéntanos en qué podemos ayudarte"
                />
                {errores.mensaje && <div className="invalid-feedback">{errores.mensaje}</div>}
              </div>
            </div>

            <button type="submit" className="btn btn-danger w-100 mt-4">Enviar mensaje</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contacto;