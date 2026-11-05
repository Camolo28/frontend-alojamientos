import { escapeHtml } from "../utils/html.js";

export function Loading(message = "Cargando información...") {
  return `
    <div class="feedback-card" role="status" aria-live="polite">
      <span class="spinner-border text-success" aria-hidden="true"></span>
      <span>${escapeHtml(message)}</span>
    </div>
  `;
}

export function ErrorState(message, retryAction = "") {
  return `
    <div class="feedback-card feedback-error" role="alert">
      <span class="feedback-icon"><i class="bi bi-wifi-off" aria-hidden="true"></i></span>
      <div>
        <h2 class="h5">No pudimos cargar la información</h2>
        <p class="mb-3">${escapeHtml(message || "Intenta nuevamente en unos segundos.")}</p>
        ${retryAction ? `<button class="btn btn-outline-success btn-sm" type="button" data-action="${escapeHtml(retryAction)}"><i class="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>Intentar de nuevo</button>` : ""}
      </div>
    </div>
  `;
}

export function EmptyState(title, message) {
  return `
    <div class="feedback-card text-center">
      <span class="feedback-icon mx-auto"><i class="bi bi-search" aria-hidden="true"></i></span>
      <h2 class="h5">${escapeHtml(title)}</h2>
      <p class="mb-0">${escapeHtml(message)}</p>
    </div>
  `;
}
