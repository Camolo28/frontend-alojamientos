export function NoAutorizadoPage() {
  return `
    <section class="container py-5">
      <h1>Acceso restringido</h1>
      <p>Esta página está disponible solo para administradores.</p>
      <a href="/perfil" class="btn btn-sand rounded-pill px-4" data-link>
        Volver a mi perfil
      </a>
    </section>
  `;
}