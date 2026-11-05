export function NotFoundPage() {
  return `
    <section class="not-found container text-center py-5">
      <span class="not-found-number">404</span>
      <span class="eyebrow d-block">Nos perdimos un poco</span>
      <h1 class="display-5 fw-semibold mt-3">Esta página no está por aquí.</h1>
      <p class="lead text-secondary mx-auto">La dirección que buscas no existe o cambió de lugar.</p>
      <a class="btn btn-dark rounded-pill px-4 mt-2" href="/" data-link><i class="bi bi-arrow-left me-2" aria-hidden="true"></i>Volver al inicio</a>
    </section>
  `;
}
