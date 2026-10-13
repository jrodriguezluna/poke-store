import { useState } from 'react';
import { Link } from 'react-router-dom';

const ARTICULOS = [
  {
    id: 'autenticidad-cartas',
    etiqueta: 'Guía de Autenticidad',
    titulo: 'Cómo identificar cartas Pokémon graduadas falsas (PSA, Beckett y CGC)',
    resumen: 'Aprende a revisar certificaciones, hologramas y estuches para reconocer señales de una carta graduada falsa.',
    autor: 'Entrenador Daniel',
    imagen: '/assets/img/blogs/CartasGradeadas.jpg',
    textoAlternativo: 'Cartas Pokémon graduadas',
    introduccion: 'El coleccionismo de cartas del juego de cartas coleccionables Pokémon (TCG) ha alcanzado cotas históricas. Debido a su valor, también han proliferado réplicas que imitan las cartas y los estuches sellados de empresas como PSA, BGS (Beckett) y CGC.',
    secciones: [
      {
        titulo: '1. Verificación del código de certificación y código QR',
        texto: 'Cada carta graduada legítima cuenta con un número de serie único emitido por la empresa certificadora. Ingresa el código en el sitio oficial y comprueba que coincidan el año, la edición, el nombre del Pokémon y la calificación. En slabs modernos, revisa también que el QR lleve a la base de datos oficial.',
      },
      {
        titulo: '2. Holograma de seguridad y microimpresión',
        texto: 'Los estuches genuinos incorporan elementos holográficos y microtexto nítido. Las imitaciones pueden usar etiquetas planas o estampados sin efecto tridimensional ni detalles legibles con lupa.',
      },
      {
        titulo: '3. Calidad del plástico y sellado',
        texto: 'Un estuche auténtico debe tener un sellado uniforme. Restos de pegamento, holgura en los bordes o grietas blanquecinas pueden ser señales de manipulación.',
      },
    ],
    consejo: 'Compra a vendedores confiables y verifica siempre el número de certificación en la fuente oficial antes de pagar.',
  },
  {
    id: 'cuidado-cartas',
    etiqueta: 'Accesorios y cuidados',
    titulo: 'Los mejores accesorios y protectores para conservar tus cartas Pokémon',
    resumen: 'Micas, toploaders y carpetas apropiadas ayudan a proteger las cartas del polvo, la humedad y los dobleces.',
    autor: 'Entrenador Jeff',
    imagen: '/assets/img/blogs/AlbumCartas.webp',
    textoAlternativo: 'Álbum y cartas Pokémon',
    introduccion: 'El valor de una carta no depende únicamente de su rareza: su estado también importa. Una doblez, un rasguño o bordes desgastados pueden afectar su conservación. Estos accesorios ayudan a proteger la colección en el uso y almacenamiento diario.',
    secciones: [
      {
        titulo: '1. Doble enfundado: perfect fit y funda estándar',
        texto: 'Una funda perfect fit ajustada, combinada con una funda estándar, añade una barrera contra polvo, humedad y derrames. Manipula las cartas con las manos limpias y evita forzar las esquinas al enfundarlas.',
      },
      {
        titulo: '2. Toploaders y protectores rígidos',
        texto: 'Para cartas valiosas o que transportas con frecuencia, un protector rígido aporta estructura y reduce el riesgo de dobleces e impactos. Guarda la carta enfundada antes de introducirla.',
      },
      {
        titulo: '3. Carpetas con carga lateral',
        texto: 'Prefiere carpetas con bolsillos cosidos y carga lateral. Evita archivadores cuyos anillos metálicos puedan presionar las cartas y guárdalas lejos de la humedad y la luz solar directa.',
      },
    ],
    consejo: 'Elige materiales de archivo libres de ácido y PVC, y mantén la colección en un lugar seco, fresco y sin exposición solar directa.',
  },
];

function Articulo({ articulo, volver }) {
  return (
    <article>
      <button type="button" className="btn btn-link px-0 mb-4 text-decoration-none" onClick={volver}>
        ← Volver a Noticias y Guías
      </button>

      <div className="mx-auto" style={{ maxWidth: '860px' }}>
        <div className="mb-3">
          <span className="badge bg-danger">{articulo.etiqueta}</span>
          <span className="text-muted small ms-2">Por {articulo.autor} · 2026</span>
        </div>
        <h1 className="fw-bold mb-4">{articulo.titulo}</h1>
        <img
          src={articulo.imagen}
          className="img-fluid rounded mb-4 w-100"
          alt={articulo.textoAlternativo}
          style={{ maxHeight: '440px', objectFit: 'cover' }}
        />
        <div className="text-secondary fs-5 lh-lg">
          <p>{articulo.introduccion}</p>
          {articulo.secciones.map((seccion) => (
            <section className="mt-4" key={seccion.titulo}>
              <h2 className="h4 fw-bold text-dark">{seccion.titulo}</h2>
              <p>{seccion.texto}</p>
            </section>
          ))}
          <aside className="alert alert-info border-0 mt-4">
            <h2 className="h5 fw-bold">Consejo PokeStore</h2>
            <p className="mb-0">{articulo.consejo}</p>
          </aside>
        </div>
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mt-5 pt-3 border-top">
          <button type="button" className="btn btn-outline-secondary" onClick={volver}>
            ← Volver a Noticias y Guías
          </button>
          <Link to="/catalogo" className="btn btn-primary">Explorar catálogo</Link>
        </div>
      </div>
    </article>
  );
}

export default function Blogs() {
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

  return (
    <div className="container py-5">
      {articuloSeleccionado ? (
        <Articulo articulo={articuloSeleccionado} volver={() => setArticuloSeleccionado(null)} />
      ) : (
        <>
          <header className="text-center mb-5">
            <p className="text-danger fw-bold text-uppercase mb-2">PokeStore · Aprende y colecciona</p>
            <h1 className="fw-bold display-5">Noticias y Guías Pokémon</h1>
            <p className="text-muted mb-0">Consejos para cuidar tu colección y comprar con confianza.</p>
          </header>

          <div className="row g-4">
            {ARTICULOS.map((articulo) => (
              <div className="col-12 col-lg-6" key={articulo.id}>
                <article className="card h-100 border-0 shadow-sm overflow-hidden">
                  <img
                    src={articulo.imagen}
                    className="card-img-top"
                    alt={articulo.textoAlternativo}
                    style={{ height: '260px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column p-4">
                    <span className="badge bg-danger align-self-start mb-3">{articulo.etiqueta}</span>
                    <h2 className="h4 fw-bold">{articulo.titulo}</h2>
                    <p className="text-muted">{articulo.resumen}</p>
                    <button
                      type="button"
                      className="btn btn-outline-dark align-self-start mt-auto"
                      onClick={() => setArticuloSeleccionado(articulo)}
                    >
                      Leer artículo <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
