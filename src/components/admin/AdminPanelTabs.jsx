const SECCIONES = [
  { id: 'productos', etiqueta: 'Productos' },
  { id: 'usuarios', etiqueta: 'Usuarios' },
  { id: 'blogs', etiqueta: 'Blogs' },
];

export default function AdminPanelTabs({ activa, onChange, children }) {
  return (
    <div className="admin-panel-tabs">
      <div className="nav nav-pills" role="tablist">
        {SECCIONES.map(({ id, etiqueta }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activa === id}
            className={`nav-link ${activa === id ? 'active' : ''}`}
            onClick={() => onChange(id)}
          >
            {etiqueta}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
