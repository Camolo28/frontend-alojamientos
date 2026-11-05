import { getAlojamiento } from "../api/alojamientos.js";
import { EmptyState, ErrorState, Loading } from "../components/Feedback.js";
import { escapeHtml, formatCop, getFirstValue, safeImageUrl } from "../utils/html.js";

function unwrapRecord(payload) {
  return payload?.data?.alojamiento ?? payload?.data ?? payload?.alojamiento ?? payload?.result ?? payload;
}

function renderDetail(stay) {
  const title = getFirstValue(stay, ["titulo", "nombre", "title", "name"], "Alojamiento");
  const city = getFirstValue(stay, ["ciudad", "city", "municipio"], "Ubicación por consultar");
  const description = getFirstValue(stay, ["descripcion", "description", "resumen"], "No hay una descripción disponible para este alojamiento.");
  const price = getFirstValue(stay, ["precio_por_noche", "precio", "price"]);
  const image = safeImageUrl(getFirstValue(stay, ["imagen_url", "imagen", "image_url", "foto"]));
  const features = stay?.comodidades ?? stay?.amenidades ?? stay?.features ?? [];
  const featureList = Array.isArray(features)
    ? features.map((feature) => typeof feature === "string" ? feature : getFirstValue(feature, ["nombre", "titulo", "name", "descripcion"], "Comodidad")).filter(Boolean)
    : [];
  return `
    <div class="detail-cover ${image ? "has-image" : ""}">
      ${image ? `<img class="detail-cover-image" src="${escapeHtml(image)}" alt="Vista de ${escapeHtml(title)}" loading="lazy">` : ""}
      ${image ? "" : `<div class="detail-cover-art"><i class="bi bi-house-heart-fill" aria-hidden="true"></i></div>`}
      <div class="detail-cover-shade"></div>
      <div class="detail-cover-copy"><a href="/alojamientos" data-link class="back-link"><i class="bi bi-arrow-left me-2" aria-hidden="true"></i>Volver al catálogo</a><span class="detail-location"><i class="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>${escapeHtml(city)}</span><h1>${escapeHtml(title)}</h1></div>
    </div>
    <div class="row g-5 py-5">
      <div class="col-lg-8"><span class="eyebrow">Conoce el lugar</span><h2 class="h3 mt-2">Una estadía para recordar</h2><p class="detail-description">${escapeHtml(description)}</p>
        <div class="detail-features"><h2 class="h4 mb-3">Lo que ofrece</h2>${featureList.length ? `<div class="row g-3">${featureList.map((feature) => `<div class="col-sm-6"><div class="feature-chip"><i class="bi bi-check-circle-fill" aria-hidden="true"></i>${escapeHtml(feature)}</div></div>`).join("")}</div>` : `<p class="text-secondary">No hay comodidades registradas para este alojamiento.</p>`}</div>
      </div>
      <aside class="col-lg-4"><div class="price-panel"><span class="eyebrow">Tarifa referencial</span><p class="price-panel-amount mt-2">${formatCop(price)}<small> / noche</small></p><p class="small text-secondary mb-0">La disponibilidad y las condiciones pueden variar.</p><a class="btn btn-dark rounded-pill w-100 mt-4" href="/comodidades" data-link>Explorar comodidades <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i></a></div></aside>
    </div>
  `;
}

export function DetallePage() {
  return `<section class="container section-space pt-4"><div id="stay-detail">${Loading("Cargando detalle...")}</div></section>`;
}

export async function loadDetallePage(id) {
  const container = document.querySelector("#stay-detail");
  if (!container) return;
  try {
    const payload = await getAlojamiento(id);
    const stay = unwrapRecord(payload);
    if (!stay || typeof stay !== "object" || Array.isArray(stay)) {
      container.innerHTML = EmptyState("No encontramos este alojamiento", "Puede que el enlace ya no esté disponible.");
      return;
    }
    container.innerHTML = renderDetail(stay);
  } catch (error) {
    container.innerHTML = ErrorState(error.message, "retry-detail");
    container.querySelector('[data-action="retry-detail"]')?.addEventListener("click", () => loadDetallePage(id));
  }
}
