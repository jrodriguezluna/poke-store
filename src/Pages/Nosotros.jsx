const ENTRENADORES = [
  {
    nombre: 'Daniel',
    cargo: 'Atención al cliente',
    descripcion:
      'Extrovertido, efusivo y devoto absoluto de Cubone. Es la voz que te recibe y la energía social que conecta con la comunidad.',
    imagen: '/assets/img/nosotros/ent1.png',
  },
  {
    nombre: 'Esteban',
    cargo: 'Control de calidad',
    descripcion:
      'Reservado, analítico y poseedor de una memoria enciclopédica sobre el universo Pokémon. Garantiza que todo el catálogo sea 100% oficial.',
    imagen: '/assets/img/nosotros/ent2.webp',
  },
  {
    nombre: 'Jeff',
    cargo: 'Logística y marketing',
    descripcion:
      'Innovador y enfocado en infraestructura. Diseña la plataforma de ventas y el empaquetado ultraresistente de cada envío.',
    imagen: '/assets/img/nosotros/ent3.webp',
  },
];

export default function Nosotros() {
  return (
    <div className="container py-4">
      {/* Estilos específicos para la sección Nosotros */}
      <style>{`
        .nosotros-section {
          padding-top: clamp(2.5rem, 5vw, 5rem);
          padding-bottom: clamp(2.5rem, 5vw, 5rem);
        }
        .nosotros-media {
          width: 100%;
          max-width: 320px;
          aspect-ratio: 1 / 1;
          object-fit: contain;
          margin: 0 auto;
        }
        .entrenador-foto {
          width: 100%;
          aspect-ratio: 3 / 4;
          object-fit: cover;
          object-position: top center;
        }
        .card-nosotros {
          border: 1.5px solid var(--bs-border-color, #ffe2dd);
          border-radius: 0.75rem;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        }
      `}</style>

      <h1 className="text-center nosotros-section pb-0">Sobre Nosotros</h1>

      {/* Orígenes */}
      <section className="nosotros-section">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-7 order-2 order-md-1">
            <div className="card card-nosotros h-100">
              <div className="card-body">
                <h2 className="h4 card-title">Orígenes</h2>
                <h3 className="h6 card-subtitle mb-3 text-body-secondary">Cómo empezó</h3>
                <p className="card-text">
                  Nuestra historia comenzó junto a una fogata en la Ruta 5, cuando tres entrenadores
                  con talentos totalmente dispares decidieron unir fuerzas: Daniel, un tipo
                  extrovertido incapaz de disimular su devoción ruidosa por Cubone; Esteban, un
                  especialista bastante reservado pero con una memoria enciclopédica sobre cartas
                  coleccionables, lore y peluches; y Jeff, un apasionado de la tecnología dedicado
                  a diseñar las herramientas y la plataforma logística perfecta para ayudar a la
                  comunidad.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-5 order-1 order-md-2 text-center">
            <img
              src="/assets/img/nosotros/entrenador.webp"
              alt="Entrenador Pokémon fundador de PokeStore"
              className="nosotros-media"
            />
          </div>
        </div>
      </section>

      {/* Misión */}
      <section className="nosotros-section pt-0">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-5 text-center">
            <img
              src="/assets/img/nosotros/pokeball2.png"
              alt="Poké Ball"
              className="nosotros-media"
            />
          </div>
          <div className="col-12 col-md-7">
            <div className="card card-nosotros h-100">
              <div className="card-body">
                <h2 className="h4 card-title">Misión</h2>
                <h3 className="h6 card-subtitle mb-3 text-body-secondary">Nuestro objetivo</h3>
                <p className="card-text">
                  Proveer a cada entrenador, coleccionista, coordinador y campeón con absolutamente
                  cualquier artículo del universo Pokémon que pueda necesitar. Operamos bajo el firme
                  compromiso de mantener un catálogo tan completo como la Poké-dex nacional,
                  garantizando que no tengas que gastar una Master Ball para conseguir lo que
                  buscas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Garantía */}
      <section className="nosotros-section pt-0">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-7 order-2 order-md-1">
            <div className="card card-nosotros h-100">
              <div className="card-body">
                <h2 className="h4 card-title">Garantía</h2>
                <h3 className="h6 card-subtitle mb-3 text-body-secondary">Siempre originales</h3>
                <p className="card-text">
                  Cada carta, peluche, figura y caja de ramen es inspeccionada minuciosamente para
                  certificar que sea 100% oficial. Nuestro empaquetado está diseñado para soportar el
                  viaje sin un solo rasguño, y si algo llega fuera de tus expectativas, gestionamos tu
                  cambio o devolución sin complicaciones.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-5 order-1 order-md-2 text-center">
            <img
              src="/assets/img/nosotros/cartas.png"
              alt="Cartas coleccionables Pokémon TCG"
              className="nosotros-media"
            />
          </div>
        </div>
      </section>

      {/* Nuestros entrenadores */}
      <section className="nosotros-section pt-0">
        <h2 className="h3 text-center mb-4">Nuestros entrenadores</h2>
        <div className="row g-4">
          {ENTRENADORES.map((entrenador) => (
            <div key={entrenador.nombre} className="col-12 col-md-4">
              <div className="card card-nosotros h-100">
                <img
                  src={entrenador.imagen}
                  alt={`${entrenador.nombre}, entrenador Pokémon`}
                  className="entrenador-foto"
                />
                <div className="card-body">
                  <h3 className="h5 card-title">{entrenador.nombre}</h3>
                  <h4 className="h6 card-subtitle mb-2 text-body-secondary">
                    {entrenador.cargo}
                  </h4>
                  <p className="card-text">{entrenador.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}