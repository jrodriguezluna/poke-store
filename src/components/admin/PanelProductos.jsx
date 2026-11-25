import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useProductos } from '../../context/ProductosContext';
import { crearProducto, actualizarProducto, eliminarProducto } from '../../services/api';
import { esStockBajo } from '../../utils/stock';

const VACIO = { nombre: '', categoria: '', precio: 0, stock: 0, imagen: '', descripcion: '' };

export default function PanelProductos() {
  const { productos, error: errorCarga, recargar } = useProductos();

  const [mostrar, setMostrar] = useState(false); // ventana flotante abierta
  const [datos, setDatos] = useState(VACIO); // producto que se está creando/editando
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState(''); // error dentro de la ventana
  const [errorLista, setErrorLista] = useState(''); // error al eliminar
  const [aviso, setAviso] = useState(''); // confirmación de lo último que se hizo

  // Sugerencias para "Categoría": las que ya existen en los productos
  const categorias = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];

  const abrir = (producto) => {
    setErrorModal('');
    setDatos(producto);
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
    const payload = {
      ...datos,
      categoria: datos.categoria || null,
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      imagen: datos.imagen || null,
      descripcion: datos.descripcion || null,
    };
    try {
      if (datos.id) await actualizarProducto(datos.id, payload);
      else await crearProducto(payload);
      await recargar(); // el catálogo, el inicio y el detalle se actualizan solos
      setAviso(datos.id ? `«${payload.nombre}» actualizado.` : `«${payload.nombre}» creado.`);
      setErrorLista('');
      cerrar();
    } catch (err) {
      setErrorModal(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const borrar = async (p) => {
    if (!window.confirm(`¿Eliminar ${p.nombre}?`)) return;
    setErrorLista('');
    try {
      await eliminarProducto(p.id);
      await recargar();
      setAviso(`«${p.nombre}» eliminado.`);
    } catch (err) {
      setErrorLista(err.message);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Productos</h2>
        <Button variant="danger" size="sm" onClick={() => abrir({ ...VACIO })}>
          Agregar producto
        </Button>
      </div>

      {errorCarga && <Alert variant="danger">{errorCarga}</Alert>}
      {errorLista && <Alert variant="danger">{errorLista}</Alert>}
      {aviso && (
        <Alert variant="success" dismissible onClose={() => setAviso('')}>
          {aviso}
        </Alert>
      )}

      {/* Si la API falló, "productos" son solo los datos locales de respaldo:
          no se ofrecen para editar porque los cambios no se podrían guardar. */}
      {!errorCarga && (
        <ListGroup variant="flush">
          {productos.map((p) => (
            <ListGroup.Item key={p.id} className="d-flex gap-3 px-0">
              {p.imagen ? (
                <img
                  src={p.imagen}
                  alt=""
                  width={48}
                  height={48}
                  className="flex-shrink-0 object-fit-contain"
                />
              ) : (
                <div className="flex-shrink-0 bg-body-secondary rounded" style={{ width: 48, height: 48 }} />
              )}
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <div className="fw-semibold text-truncate">{p.nombre}</div>
                <div className="small text-secondary">
                  {p.categoria || 'Sin categoría'} · ${Number(p.precio ?? 0).toLocaleString('es-CL')} · Stock {p.stock}
                  {p.stock === 0 && <Badge bg="danger" className="ms-2">Agotado</Badge>}
                  {p.stock !== 0 && esStockBajo(p.stock) && (
                    <Badge bg="warning" text="dark" className="ms-2">Stock bajo</Badge>
                  )}
                </div>
                <div className="d-flex gap-2 mt-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    aria-label={`Editar ${p.nombre}`}
                    onClick={() => abrir(p)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    aria-label={`Eliminar ${p.nombre}`}
                    onClick={() => borrar(p)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Ventana flotante para crear / editar */}
      <Modal show={mostrar} onHide={cerrar} centered>
        <Form onSubmit={guardar}>
          <Modal.Header closeButton>
            <Modal.Title as="h2" className="h5">
              {datos.id ? 'Editar producto' : 'Agregar producto'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorModal && <Alert variant="danger">{errorModal}</Alert>}

            <Form.Group className="mb-3" controlId="producto-nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={datos.nombre ?? ''} onChange={onChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="producto-categoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                name="categoria"
                list="producto-categorias"
                placeholder="Ej: Peluches"
                value={datos.categoria ?? ''}
                onChange={onChange}
              />
              <datalist id="producto-categorias">
                {categorias.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="producto-precio">
                  <Form.Label>Precio (CLP)</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    name="precio"
                    value={datos.precio ?? ''}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="producto-stock">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    name="stock"
                    value={datos.stock ?? ''}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="producto-imagen">
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control type="url" name="imagen" value={datos.imagen ?? ''} onChange={onChange} />
            </Form.Group>

            <Form.Group controlId="producto-descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={datos.descripcion ?? ''}
                onChange={onChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={cerrar}>
              Cancelar
            </Button>
            <Button type="submit" variant="danger" disabled={guardando}>
              {datos.id ? 'Guardar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
