import { getAlojamiento, getComodidades } from "../api/alojamientos.js";
import { actualizarAlojamiento, eliminarAlojamiento, asignarComodidades } from "../api/alojamientos.api.js";
import { AlojamientoForm, conectarAlojamientoForm } from "../components/AlojamientoForm.js";
import { ComodidadesSelector, leerComodidades } from "../components/ComodidadesSelector.js";
import { obtenerSesion } from "../state/sesion.js";
import { obtenerAlojamiento, puedeGestionar } from "../utils/gestion.js";
import { unwrapCollection } from "../utils/html.js";
import { navigate } from "../router/router.js";

export function EditarAlojamientoPage() {
  return `<section class="container py-5 gestion-page"><h1>Editar alojamiento</h1><div id="editar-alojamiento" aria-live="polite">Cargando alojamiento…</div></section>`;
}
export async function loadEditarAlojamientoPage(id) {
  const contenedor = document.querySelector("#editar-alojamiento");
  const sesion = obtenerSesion();
  if (!contenedor || !sesion) return;
  try {
    const alojamiento = obtenerAlojamiento(await getAlojamiento(id));
    if (!contenedor.isConnected) return;
    if (!puedeGestionar(alojamiento, sesion.usuario)) { navigate("/no-autorizado"); return; }
    const comodidades = unwrapCollection(await getComodidades(), ["comodidades"]);
    if (!contenedor.isConnected) return;
    contenedor.innerHTML = `${AlojamientoForm(alojamiento)}
      <form id="comodidades-form" class="gestion-form mt-4">
      ${ComodidadesSelector(comodidades, (alojamiento.comodidades ?? []).map((item) => item.id))}
      <p class="small">Guardar reemplaza la selección completa. Desmarca todas para retirar las comodidades.</p>
      <button type="submit" class="btn btn-sand">Guardar comodidades</button>
      <p role="status" class="mt-3" data-mensaje></p></form>
      <button id="eliminar-alojamiento" type="button" class="btn btn-outline-danger mt-4">Eliminar alojamiento</button>
      <p id="eliminar-mensaje" role="status"></p>`;
    // Each save is independent so a failed association does not hide a saved edit.
    conectarAlojamientoForm(contenedor.querySelector("#alojamiento-form"), async (datos) => {
      bloquear(true);
      try { await actualizarAlojamiento(id, datos, sesion.token); }
      finally { bloquear(false); }
    });
    const form = contenedor.querySelector("#comodidades-form");
    const eliminar = contenedor.querySelector("#eliminar-alojamiento");
    const controles = contenedor.querySelectorAll("button");
    function bloquear(valor) { controles.forEach((boton) => { boton.disabled = valor; }); }
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.querySelector("button").disabled) return;
      const ids = leerComodidades(form);
      const mensaje = form.querySelector("[data-mensaje]");
      bloquear(true);
      mensaje.textContent = "Guardando comodidades…";
      try {
        await asignarComodidades(id, ids, sesion.token);
        mensaje.textContent = "Comodidades guardadas.";
      } catch (error) { mensaje.textContent = error.message; }
      finally { bloquear(false); }
    });
    eliminar.addEventListener("click", async () => {
      if (eliminar.disabled || !window.confirm("¿Eliminar este alojamiento definitivamente?")) return;
      bloquear(true);
      const mensaje = contenedor.querySelector("#eliminar-mensaje");
      mensaje.textContent = "Eliminando…";
      try {
        await eliminarAlojamiento(id, sesion.token);
        if (contenedor.isConnected) navigate("/mis-alojamientos");
      } catch (error) { mensaje.textContent = error.message; }
      finally { bloquear(false); }
    });
  } catch (error) { contenedor.textContent = error.message; }
}
