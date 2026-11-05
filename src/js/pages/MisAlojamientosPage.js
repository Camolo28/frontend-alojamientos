import { getAlojamientos } from "../api/alojamientos.js";
import { obtenerSesion } from "../state/sesion.js";
import { filtrarPropios } from "../utils/gestion.js";
import { escapeHtml, formatCop, unwrapCollection } from "../utils/html.js";
export function MisAlojamientosPage() {
  return `<section class="container py-5"><h1>Mis alojamientos</h1>
    <a href="/alojamientos/nuevo" data-link class="btn btn-sand mb-4">Publicar alojamiento</a>
    <div id="mis-alojamientos" aria-live="polite">Consultando tus publicaciones…</div></section>`;
}
export async function loadMisAlojamientosPage() {
  const contenedor = document.querySelector("#mis-alojamientos");
  const sesion = obtenerSesion();
  if (!contenedor || !sesion) return;
  try {
    const items = filtrarPropios(unwrapCollection(await getAlojamientos(), ["alojamientos"]), sesion.usuario.id);
    if (!contenedor.isConnected) return;
    contenedor.innerHTML = items.length ? items.map((item) => `<article class="card p-4 mb-3">
      <h2 class="h4">${escapeHtml(item.titulo)}</h2><p>${escapeHtml(item.ciudad)} · ${formatCop(item.precio_por_noche)}</p>
      <div class="d-flex gap-3"><a href="/alojamientos/${encodeURIComponent(item.id)}" data-link>Ver detalle</a>
      <a href="/alojamientos/${encodeURIComponent(item.id)}/editar" data-link>Editar y gestionar</a></div></article>`).join("") : "Todavía no has publicado alojamientos.";
  } catch (error) { contenedor.textContent = error.message; }
}
