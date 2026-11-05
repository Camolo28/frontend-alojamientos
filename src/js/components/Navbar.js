export function Navbar(activePath = "") {
  const links = [
    ["/", "Inicio", "bi-house-door"],
    ["/alojamientos", "Alojamientos", "bi-buildings"],
    ["/comodidades", "Comodidades", "bi-stars"],
    ["/estado-api", "Estado de API", "bi-activity"],
  ];

  return `
    <nav class="navbar navbar-expand-lg navbar-dark site-navbar sticky-top" aria-label="Navegación principal">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="/" data-link aria-label="Refugio, inicio">
          <span class="brand-mark"><i class="bi bi-compass-fill" aria-hidden="true"></i></span>
          <span>refugio<span class="brand-period">.</span></span>
        </a>
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavigation" aria-controls="mainNavigation" aria-expanded="false" aria-label="Abrir menú">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNavigation">
          <div class="navbar-nav ms-auto align-items-lg-center gap-lg-1 py-3 py-lg-0">
            ${links.map(([href, label, icon]) => `
              <a class="nav-link ${activePath === href ? "active" : ""}" href="${href}" data-link ${activePath === href ? 'aria-current="page"' : ""}>
                <i class="bi ${icon} me-1" aria-hidden="true"></i>${label}
              </a>
            `).join("")}
          </div>
        </div>
      </div>
    </nav>
  `;
}
