import { AlojamientoForm, conectarAlojamientoForm } from "../components/AlojamientoForm.js";
import { crearAlojamiento } from "../api/alojamientos.api.js";
import { obtenerSesion } from "../state/sesion.js";
import { navigate } from "../router/router.js";
export function CrearAlojamientoPage() {
  return `<section class="container py-5 gestion-page"><h1>Publicar alojamiento</h1>${AlojamientoForm({}, "Publicar")}</section>`;
}
export function loadCrearAlojamientoPage() {
  const form = document.querySelector("#alojamiento-form");
  const sesion = obtenerSesion();
  if (!form || !sesion) return;
  conectarAlojamientoForm(form, async (datos) => {
    await crearAlojamiento(datos, sesion.token);
    if (form.isConnected) navigate("/mis-alojamientos");
  });
}
