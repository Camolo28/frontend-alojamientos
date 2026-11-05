import { getAlojamientos } from "../api/alojamientos.js";
import { AlojamientoCard } from "../components/AlojamientoCard.js";
import { EmptyState, ErrorState, Loading } from "../components/Feedback.js";
import { escapeHtml, getFirstValue, unwrapCollection } from "../utils/html.js";

export function HomePage() {
  return `
    <section class="home-hero">
      <div class="container position-relative">
        <div class="row align-items-center min-vh-hero g-5">
          <div class="col-lg-7 col-xl-6">
            <span class="eyebrow eyebrow-light"><span></span>Tu próxima pausa empieza aquí</span>
            <h1 class="display-3 fw-semibold hero-title mt-3">Un buen viaje<br><em>necesita un buen lugar.</em></h1>
            <p class="lead hero-copy mt-4">Explora alojamientos con encanto y encuentra ese espacio que hace especial cada destino.</p>
            <div class="d-flex flex-wrap gap-3 mt-4">
              <a class="btn btn-sand btn-lg rounded-pill px-4" href="/alojamientos" data-link>Explorar alojamientos <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i></a>
              <a class="btn btn-outline-light btn-lg rounded-pill px-4" href="/comodidades" data-link>Ver comodidades</a>
            </div>
            <div class="hero-note mt-5"><i class="bi bi-shield-check me-2" aria-hidden="true"></i>Información consultada directamente desde nuestra API</div>
          </div>
          <div class="col-lg-5 col-xl-6 d-none d-lg-block">
            <div class="hero-art" aria-hidden="true">
              <div class="sun-disc"></div><div class="landscape landscape-back"></div><div class="landscape landscape-front"></div>
              <div class="hero-window"><i class="bi bi-house-heart-fill"></i></div>
              <div class="hero-art-caption"><span>Encuentra tu refugio</span><i class="bi bi-arrow-down-right"></i></div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-grain" aria-hidden="true"></div>
    </section>
    <section class="container section-space">
      <div class="section-heading d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div><span class="eyebrow">Para empezar a explorar</span><h2 class="display-6 fw-semibold mt-2 mb-0">Alojamientos destacados</h2></div>
        <a class="text-link" href="/alojamientos" data-link>Ver todos <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i></a>
      </div>
      <div id="home-stays" class="row g-4" aria-live="polite">${Loading("Buscando alojamientos...")}</div>
    </section>
    <section class="promise-band">
      <div class="container py-5"><div class="row g-4">
        <div class="col-md-4"><div class="promise-item"><span>01</span><div><h3>Explora</h3><p>Encuentra opciones para distintos planes y destinos.</p></div></div></div>
        <div class="col-md-4"><div class="promise-item"><span>02</span><div><h3>Conoce</h3><p>Revisa detalles y comodidades antes de elegir.</p></div></div></div>
        <div class="col-md-4"><div class="promise-item"><span>03</span><div><h3>Disfruta</h3><p>Imagina tu próxima escapada con toda la información a mano.</p></div></div></div>
      </div></div>
    </section>
  `;
}

export async function loadHomePage() {
  const container = document.querySelector("#home-stays");
  if (!container) return;
  try {
    const payload = await getAlojamientos();
    const stays = unwrapCollection(payload, ["alojamientos"]).slice(0, 3);
    container.innerHTML = stays.length
      ? stays.map(AlojamientoCard).map((card) => `<div class="col-md-6 col-xl-4">${card}</div>`).join("")
      : `<div class="col-12">${EmptyState("Todavía no hay alojamientos", "Cuando se publiquen opciones, aparecerán aquí.")}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="col-12">${ErrorState(error.message, "retry-home")}</div>`;
    container.querySelector('[data-action="retry-home"]')?.addEventListener("click", loadHomePage);
  }
}
