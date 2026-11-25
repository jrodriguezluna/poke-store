import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import AdminListFilters from './AdminListFilters';
import AdminPanelTabs from './AdminPanelTabs';
import {
  actualizarBlog,
  crearBlog,
  eliminarBlog,
  listarBlogs,
} from '../../services/api';

const nuevoBlog = () => ({
  etiqueta: '',
  titulo: '',
  resumen: '',
  autor: '',
  imagen: '',
  textoAlternativo: '',
  introduccion: '',
  secciones: [{ titulo: '', texto: '' }],
  consejo: '',
});

export default function PanelBlogs({
  seccionActiva = 'blogs',
  onCambiarSeccion = () => {},
}) {
  const [blogs, setBlogs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [datos, setDatos] = useState(nuevoBlog);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState('');
  const [errorLista, setErrorLista] = useState('');
  const [aviso, setAviso] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const consulta = busqueda.trim().toLocaleLowerCase();
  const blogsFiltrados = blogs.filter((blog) =>
    (!consulta
      || `${blog.titulo ?? ''} ${blog.etiqueta ?? ''} ${blog.autor ?? ''}`.toLocaleLowerCase().includes(consulta))
  );

  const recargar = async () => {
    setCargando(true);
    try {
      setBlogs(await listarBlogs());
      setErrorCarga('');
    } catch (error) {
      setBlogs([]);
      setErrorCarga(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    recargar();
  }, []);

  const abrir = (blog = null) => {
    setErrorModal('');
    setDatos(blog
      ? { ...blog, secciones: blog.secciones.map(({ titulo, texto }) => ({ titulo, texto })) }
      : nuevoBlog());
    setMostrar(true);
  };

  const cambiarCampo = (event) => {
    const { name, value } = event.target;
    setDatos((anterior) => ({ ...anterior, [name]: value }));
  };

  const cambiarSeccion = (indice, campo, valor) => {
    setDatos((anterior) => ({
      ...anterior,
      secciones: anterior.secciones.map((seccion, index) =>
        index === indice ? { ...seccion, [campo]: valor } : seccion
      ),
    }));
  };

  const moverSeccion = (indice, direccion) => {
    setDatos((anterior) => {
      const secciones = [...anterior.secciones];
      const destino = indice + direccion;
      [secciones[indice], secciones[destino]] = [secciones[destino], secciones[indice]];
      return { ...anterior, secciones };
    });
  };

  const guardar = async (event) => {
    event.preventDefault();
    setErrorModal('');
    setGuardando(true);
    const payload = {
      ...datos,
      imagen: datos.imagen.trim() || null,
      textoAlternativo: datos.textoAlternativo.trim() || null,
      consejo: datos.consejo.trim() || null,
      secciones: datos.secciones.map(({ titulo, texto }) => ({ titulo, texto })),
    };

    try {
      if (datos.id) {
        await actualizarBlog(datos.id, payload);
      } else {
        await crearBlog(payload);
      }
      setMostrar(false);
      setAviso(datos.id ? `«${payload.titulo}» actualizado.` : `«${payload.titulo}» creado.`);
      setErrorLista('');
      await recargar();
    } catch (error) {
      setErrorModal(error.message);
    } finally {
      setGuardando(false);
    }
  };

  const borrar = async (blog) => {
    if (!window.confirm(`¿Eliminar «${blog.titulo}»?`)) return;
    setErrorLista('');
    try {
      await eliminarBlog(blog.id);
      setAviso(`«${blog.titulo}» eliminado.`);
      await recargar();
    } catch (error) {
      setErrorLista(error.message);
    }
  };

  return (
    <>
      <AdminPanelTabs activa={seccionActiva} onChange={onCambiarSeccion}>
        <Button variant="success" size="sm" onClick={() => abrir()}>
          Agregar blog
        </Button>
      </AdminPanelTabs>
      <AdminListFilters
        search={busqueda}
        onSearchChange={setBusqueda}
        searchLabel="Buscar blogs"
        searchPlaceholder="Buscar blogs"
      />

      {errorCarga && <Alert variant="danger">{errorCarga}</Alert>}
      {errorLista && <Alert variant="danger">{errorLista}</Alert>}
      {aviso && (
        <Alert variant="success" dismissible onClose={() => setAviso('')}>
          {aviso}
        </Alert>
      )}
      {cargando && <div role="status">Cargando blogs...</div>}
      {!cargando && !errorCarga && blogsFiltrados.length === 0 && (
        <Alert variant="info">
          {blogs.length === 0 ? 'Todavía no hay artículos.' : 'No se encontraron artículos.'}
        </Alert>
      )}

      {!cargando && !errorCarga && blogsFiltrados.length > 0 && (
        <ListGroup variant="flush">
          {blogsFiltrados.map((blog) => (
            <ListGroup.Item key={blog.id} className="d-flex gap-3 px-0">
              {blog.imagen ? (
                <img
                  src={blog.imagen}
                  alt=""
                  width={56}
                  height={56}
                  className="flex-shrink-0 rounded object-fit-cover"
                />
              ) : (
                <div className="flex-shrink-0 bg-body-secondary rounded" style={{ width: 56, height: 56 }} />
              )}
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <div className="fw-semibold text-wrap">{blog.titulo}</div>
                <div className="small text-secondary">{blog.etiqueta} · {blog.autor}</div>
                <div className="d-flex gap-2 mt-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    aria-label={`Editar ${blog.titulo}`}
                    onClick={() => abrir(blog)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    aria-label={`Eliminar ${blog.titulo}`}
                    onClick={() => borrar(blog)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <Modal
        show={mostrar}
        onHide={() => setMostrar(false)}
        centered
        scrollable
        size="xl"
        fullscreen="lg-down"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">
            {datos.id ? 'Editar blog' : 'Agregar blog'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body p-4">
          <Form id="blog-form" onSubmit={guardar}>
            {errorModal && <Alert variant="danger">{errorModal}</Alert>}
            <Row className="g-3">
              <Col md={4}>
                <Form.Group controlId="blog-etiqueta">
                  <Form.Label>Etiqueta</Form.Label>
                  <Form.Control name="etiqueta" value={datos.etiqueta} onChange={cambiarCampo} required maxLength={100} />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group controlId="blog-titulo">
                  <Form.Label>Título</Form.Label>
                  <Form.Control name="titulo" value={datos.titulo} onChange={cambiarCampo} required maxLength={200} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="blog-resumen">
                  <Form.Label>Resumen</Form.Label>
                  <Form.Control as="textarea" rows={2} name="resumen" value={datos.resumen} onChange={cambiarCampo} required maxLength={1000} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="blog-autor">
                  <Form.Label>Autor</Form.Label>
                  <Form.Control name="autor" value={datos.autor} onChange={cambiarCampo} required maxLength={100} />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group controlId="blog-imagen">
                  <Form.Label>URL o ruta de imagen</Form.Label>
                  <Form.Control
                    name="imagen"
                    value={datos.imagen ?? ''}
                    onChange={cambiarCampo}
                    maxLength={500}
                    placeholder="https://... o /assets/img/blogs/..."
                  />
                  <Form.Text>La ruta debe apuntar a una imagen accesible desde el navegador.</Form.Text>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="blog-texto-alternativo">
                  <Form.Label>Texto alternativo de imagen</Form.Label>
                  <Form.Control
                    name="textoAlternativo"
                    value={datos.textoAlternativo ?? ''}
                    onChange={cambiarCampo}
                    maxLength={255}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="blog-introduccion">
                  <Form.Label>Introducción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="introduccion"
                    value={datos.introduccion}
                    onChange={cambiarCampo}
                    required
                    maxLength={10000}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
              <Form.Label className="mb-0">Secciones</Form.Label>
              <Button
                type="button"
                size="sm"
                variant="outline-primary"
                onClick={() => setDatos((anterior) => ({
                  ...anterior,
                  secciones: [...anterior.secciones, { titulo: '', texto: '' }],
                }))}
              >
                Agregar sección
              </Button>
            </div>
            {datos.secciones.map((seccion, indice) => (
              <Row className="g-3 border rounded p-3 mb-3 mx-0" key={indice}>
                <Col md={4}>
                  <Form.Group controlId={`blog-seccion-titulo-${indice}`}>
                    <Form.Label>Encabezado {indice + 1}</Form.Label>
                    <Form.Control
                      value={seccion.titulo}
                      onChange={(event) => cambiarSeccion(indice, 'titulo', event.target.value)}
                      required
                      maxLength={200}
                    />
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group controlId={`blog-seccion-texto-${indice}`}>
                    <Form.Label>Contenido</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={seccion.texto}
                      onChange={(event) => cambiarSeccion(indice, 'texto', event.target.value)}
                      required
                      maxLength={10000}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <div className="d-flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline-secondary"
                      aria-label={`Subir sección ${indice + 1}`}
                      disabled={indice === 0}
                      onClick={() => moverSeccion(indice, -1)}
                    >
                      Subir
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline-secondary"
                      aria-label={`Bajar sección ${indice + 1}`}
                      disabled={indice === datos.secciones.length - 1}
                      onClick={() => moverSeccion(indice, 1)}
                    >
                      Bajar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline-danger"
                      disabled={datos.secciones.length === 1}
                      onClick={() => setDatos((anterior) => ({
                        ...anterior,
                        secciones: anterior.secciones.filter((_, index) => index !== indice),
                      }))}
                    >
                      Quitar
                    </Button>
                  </div>
                </Col>
              </Row>
            ))}

            <Form.Group className="mt-4" controlId="blog-consejo">
              <Form.Label>Consejo PokeStore (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="consejo"
                value={datos.consejo ?? ''}
                onChange={cambiarCampo}
                maxLength={5000}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="outline-secondary" onClick={() => setMostrar(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="blog-form" variant="danger" disabled={guardando}>
            {guardando ? 'Guardando...' : datos.id ? 'Guardar' : 'Crear'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
