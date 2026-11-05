import { escapeHtml, formatCop, getFirstValue, safeImageUrl } from "../utils/html.js";

export function AlojamientoCard(alojamiento) {
  const id = getFirstValue(alojamiento, ["id", "alojamiento_id"]);
  const title = getFirstValue(alojamiento, ["titulo", "nombre", "title", "name"], "Alojamiento sin título");
  const city = getFirstValue(alojamiento, ["ciudad", "city", "municipio"], "Ubicación por consultar");
  const description = getFirstValue(alojamiento, ["descripcion", "description", "resumen"], "Un lugar pensado para disfrutar y descansar.");
  const image = safeImageUrl(getFirstValue(alojamiento, ["imagen_url", "imagen", "image_url", "foto"]));
  const imageMarkup = image
    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy" class="stay-card-image">`
    : `<div class="stay-card-placeholder" aria-label="Imagen no disponible"><i class="bi bi-house-heart" aria-hidden="true"></i><span>Un lugar para descansar</span></div>`;

  return `
    <article class="stay-card h-100 d-flex flex-column">
      <div class="stay-card-media flex-shrink-0">${imageMarkup}<span class="stay-card-badge"><i class="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>${escapeHtml(city)}</span></div>
      <div class="p-4 d-flex flex-column flex-grow-1">
        <h2 class="h5 stay-card-title">${escapeHtml(title)}</h2>
        <p class="stay-card-description flex-grow-1">${escapeHtml(description)}</p>
        <div class="d-flex justify-content-between align-items-center gap-3 pt-3 border-top">
          <span class="stay-price">${formatCop(getFirstValue(alojamiento, ["precio_por_noche", "precio", "price"]))}<small>/ noche</small></span>
          ${id !== "" ? `<a class="btn btn-dark btn-sm rounded-pill px-3" href="/alojamientos/${encodeURIComponent(id)}" data-link aria-label="Ver detalles de ${escapeHtml(title)}">Ver detalle <i class="bi bi-arrow-up-right ms-1" aria-hidden="true"></i></a>` : ""}
        </div>
      </div>
    </article>
  `;
}
