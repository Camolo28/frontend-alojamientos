import { getAlojamientos } from "../api/alojamientos.js";
import { AlojamientoCard } from "../components/AlojamientoCard.js";
import { EmptyState, ErrorState, Loading } from "../components/Feedback.js";
import { filterAlojamientos, unwrapCollection } from "../utils/html.js";

let alojamientos = [];

function renderResults(term = "") {
  const container = document.querySelector("#stay-results");
  const count = document.querySelector("#stay-count");
  if (!container) return;

  const visible = filterAlojamientos(alojamientos, term);
  if (count) count.textContent = `${visible.length} ${visible.length === 1 ? "alojamiento" : "alojamientos"}`;
  container.innerHTML = visible.length
    ? visible.map(AlojamientoCard).map((card) => `<div class="col-md-6 col-xl-4">${card}</div>`).join("")
    : `<div class="col-12">${EmptyState("No encontramos resultados", "Prueba con otro título o ciudad.")}</div>`;
}

export function AlojamientosPage() {
  return `
    <section class="page-hero page-hero-green"><div class="container py-5 py-lg-6">
      <span class="eyebrow eyebrow-light"><span></span>Catálogo</span>
      <h1 class="display-4 fw-semibold mt-3 mb-2">Alojamientos para cada plan.</h1>
      <p class="lead mb-0 page-hero-copy">Busca, compara y conoce los detalles de cada lugar.</p>
    </div></section>
    <section class="container section-space">
      <div class="search-panel row g-3 align-items-center mb-4">
        <div class="col-md"><label class="form-label visually-hidden" for="stay-search">Buscar por título o ciudad</label><div class="input-group input-group-lg"><span class="input-group-text bg-white border-end-0"><i class="bi bi-search" aria-hidden="true"></i></span><input id="stay-search" class="form-control border-start-0 ps-0" type="search" placeholder="Busca por título o ciudad" autocomplete="off"></div></div>
        <div class="col-md-auto"><span id="stay-count" class="result-count">Cargando...</span></div>
      </div>
      <div id="stay-results" class="row g-4" aria-live="polite">${Loading("Cargando alojamientos...")}</div>
    </section>
  `;
}

export async function loadAlojamientosPage() {
  const container = document.querySelector("#stay-results");
  const count = document.querySelector("#stay-count");
  if (!container) return;
  container.innerHTML = Loading("Cargando alojamientos...");
  if (count) count.textContent = "Cargando...";
  try {
    const payload = await getAlojamientos();
    alojamientos = unwrapCollection(payload, ["alojamientos"]);
    renderResults(document.querySelector("#stay-search")?.value || "");
    document.querySelector("#stay-search")?.addEventListener("input", (event) => renderResults(event.target.value));
  } catch (error) {
    container.innerHTML = `<div class="col-12">${ErrorState(error.message, "retry-stays")}</div>`;
    if (count) count.textContent = "";
    container.querySelector('[data-action="retry-stays"]')?.addEventListener("click", loadAlojamientosPage);
  }
}
