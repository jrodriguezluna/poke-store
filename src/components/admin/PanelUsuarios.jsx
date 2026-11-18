import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useAuth } from '../../context/AuthContext';
import { listarUsuarios, modificarUsuario, eliminarUsuario } from '../../services/api';

const CAMPOS = [
  { name: 'nombre', label: 'Nombre' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'telefono', label: 'Teléfono', opcional: true },
  { name: 'direccion', label: 'Dirección' },
  { name: 'region', label: 'Región' },
  { name: 'comuna', label: 'Comuna' },
];

export default function PanelUsuarios() {
  const { user, guardarSesion } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [mostrar, setMostrar] = useState(false); // ventana flotante abierta
  const [datos, setDatos] = useState({}); // usuario que se está editando
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(''); // error de carga / eliminación
  const [errorModal, setErrorModal] = useState(''); // error dentro de la ventana
  const [aviso, setAviso] = useState('');

  const cargar = () =>
    listarUsuarios()
      .then(setUsuarios)
      .catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
  }, []);

  const abrir = (usuario) => {
    setErrorModal('');
    setDatos(usuario);
    setMostrar(true);
  };
  const cerrar = () => setMostrar(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setDatos((anterior) => ({ ...anterior, [name]: value }));
  };

  const guardar = async (e) => {
    e.preventDefault();
    setErrorModal('');
    setGuardando(true);
    try {
      await modificarUsuario(datos.id, {
        ...datos,
        telefono: datos.telefono || null,
        password: datos.password || null,
      });
      // Si el admin se editó a sí mismo, refrescamos su sesión para que
      // Perfil (y el panel, si se quitó el rol admin) reflejen el cambio.
      if (datos.id === user?.id) {
        const { password: _omitida, ...sinPassword } = datos;
        guardarSesion({ ...user, ...sinPassword });
      }
      await cargar();
      setError('');
      setAviso(`«${datos.nombre}» actualizado.`);
      cerrar();
    } catch (err) {
      setErrorModal(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const borrar = async (u) => {
    if (!window.confirm(`¿Eliminar a ${u.nombre}?`)) return;
    setError('');
    try {
      await eliminarUsuario(u.id);
      await cargar();
      setAviso(`«${u.nombre}» eliminado.`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h2 className="h5 mb-3">Usuarios</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {aviso && (
        <Alert variant="success" dismissible onClose={() => setAviso('')}>
          {aviso}
        </Alert>
      )}

      <ListGroup variant="flush">
        {usuarios.map((u) => (
          <ListGroup.Item key={u.id} className="px-0">
            <div className="d-flex justify-content-between align-items-start gap-2">
              <div style={{ minWidth: 0 }}>
                <div className="fw-semibold text-truncate">{u.nombre}</div>
                <div className="small text-secondary text-truncate">{u.email}</div>
              </div>
              <Badge bg={u.rol === 'admin' ? 'danger' : 'secondary'}>{u.rol}</Badge>
            </div>
            <div className="d-flex gap-2 mt-2">
              <Button
                variant="outline-secondary"
                size="sm"
                aria-label={`Editar ${u.nombre}`}
                onClick={() => abrir(u)}
              >
                Editar
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                aria-label={`Eliminar ${u.nombre}`}
                onClick={() => borrar(u)}
              >
                Eliminar
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Ventana flotante para editar */}
      <Modal show={mostrar} onHide={cerrar} centered>
        <Form onSubmit={guardar}>
          <Modal.Header closeButton>
            <Modal.Title as="h2" className="h5">
              Editar usuario
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorModal && <Alert variant="danger">{errorModal}</Alert>}

            <Row>
              {CAMPOS.map(({ name, label, type = 'text', opcional }) => (
                <Col md={6} key={name} className="mb-3">
                  <Form.Group controlId={`usuario-${name}`}>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control
                      type={type}
                      name={name}
                      value={datos[name] ?? ''}
                      onChange={onChange}
                      required={!opcional}
                    />
                  </Form.Group>
                </Col>
              ))}
              <Col md={6} className="mb-3">
                <Form.Group controlId="usuario-rol">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select name="rol" value={datos.rol ?? 'cliente'} onChange={onChange}>
                    <option value="cliente">cliente</option>
                    <option value="admin">admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="usuario-password">
                  <Form.Label>Nueva contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Opcional"
                    value={datos.password ?? ''}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={cerrar}>
              Cancelar
            </Button>
            <Button type="submit" variant="danger" disabled={guardando}>
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
