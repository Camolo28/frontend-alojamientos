import { getHealth } from "../api/alojamientos.js";
import { ErrorState, Loading } from "../components/Feedback.js";
import { escapeHtml, getFirstValue } from "../utils/html.js";

export function EstadoApiPage() {
  return `
    <section class="page-hero page-hero-green"><div class="container py-5 py-lg-6"><span class="eyebrow eyebrow-light"><span></span>Conexión</span><h1 class="display-4 fw-semibold mt-3 mb-2">Estado del servicio</h1><p class="lead mb-0 page-hero-copy">Comprueba la comunicación entre esta aplicación y el backend.</p></div></section>
    <section class="container section-space"><div class="row justify-content-center"><div class="col-lg-8"><div id="api-status">${Loading("Consultando la API...")}</div></div></div></section>
  `;
}

export async function loadEstadoApiPage() {
  const container = document.querySelector("#api-status");
  if (!container) return;
  try {
    const payload = await getHealth();
    const data = payload?.data ?? payload;
    const status = getFirstValue(data, ["status", "estado"], "ok");
    const service = getFirstValue(data, ["service", "servicio"], "alojamientos-api");
    const version = getFirstValue(data, ["version"], "v1");
    container.innerHTML = `
      <article class="api-status-card">
        <div class="api-status-heading"><span class="status-pulse"></span><div><span class="eyebrow">Respuesta del servidor</span><h2 class="h3 mb-0 mt-1">${escapeHtml(String(status).toUpperCase()) === "OK" ? "Conexión activa" : escapeHtml(status)}</h2></div></div>
        <div class="api-status-grid mt-4"><div><span>Servicio</span><strong>${escapeHtml(service)}</strong></div><div><span>Versión</span><strong>${escapeHtml(version)}</strong></div><div><span>Estado HTTP</span><strong>200 · Correcto</strong></div></div>
        <p class="small text-secondary mt-4 mb-0"><i class="bi bi-info-circle me-1" aria-hidden="true"></i>La información se consulta en tiempo real desde <code>/health</code>.</p>
      </article>
    `;
  } catch (error) {
    container.innerHTML = ErrorState(error.message, "retry-health");
    container.querySelector('[data-action="retry-health"]')?.addEventListener("click", loadEstadoApiPage);
  }
}
