import { getComodidades } from "../api/alojamientos.js";
import { EmptyState, ErrorState, Loading } from "../components/Feedback.js";
import { escapeHtml, getFirstValue, unwrapCollection } from "../utils/html.js";

function renderComodidad(item, index) {
  const title = typeof item === "string" ? item : getFirstValue(item, ["nombre", "titulo", "name", "descripcion"], "Comodidad");
  const icon = typeof item === "object" ? getFirstValue(item, ["icono", "icon", "icono_bootstrap"], "bi-stars") : "bi-stars";
  const description = typeof item === "object" ? getFirstValue(item, ["descripcion", "description"], "Un detalle que puede hacer más cómoda tu estadía.") : "Un detalle que puede hacer más cómoda tu estadía.";
  return `<article class="amenity-card h-100"><span class="amenity-number">${String(index + 1).padStart(2, "0")}</span><span class="amenity-icon"><i class="bi ${escapeHtml(icon)}" aria-hidden="true"></i></span><h2 class="h5 mt-4">${escapeHtml(title)}</h2><p class="mb-0">${escapeHtml(description)}</p></article>`;
}

export function ComodidadesPage() {
  return `
    <section class="page-hero page-hero-sand"><div class="container py-5 py-lg-6"><span class="eyebrow"><span></span>Pequeños detalles, grandes momentos</span><h1 class="display-4 fw-semibold mt-3 mb-2">Comodidades que<br class="d-none d-md-block"> hacen la diferencia.</h1><p class="lead mb-0 page-hero-copy">Descubre los servicios y espacios disponibles en los alojamientos.</p></div></section>
    <section class="container section-space"><div class="section-heading mb-4"><span class="eyebrow">Pensadas para ti</span><h2 class="display-6 fw-semibold mt-2">Todo lo que puedes encontrar</h2></div><div id="amenities-list" class="row g-4" aria-live="polite">${Loading("Cargando comodidades...")}</div></section>
  `;
}

export async function loadComodidadesPage() {
  const container = document.querySelector("#amenities-list");
  if (!container) return;
  try {
    const payload = await getComodidades();
    const amenities = unwrapCollection(payload, ["comodidades", "amenidades"]);
    container.innerHTML = amenities.length
      ? amenities.map(renderComodidad).map((card) => `<div class="col-sm-6 col-lg-4">${card}</div>`).join("")
      : `<div class="col-12">${EmptyState("Aún no hay comodidades", "La información aparecerá cuando esté disponible en la API.")}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="col-12">${ErrorState(error.message, "retry-amenities")}</div>`;
    container.querySelector('[data-action="retry-amenities"]')?.addEventListener("click", loadComodidadesPage);
  }
}
