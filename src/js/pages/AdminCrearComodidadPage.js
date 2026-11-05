import { crearComodidad } from "../api/comodidades.api.js";
import { validarComodidad } from "../utils/validaciones.js";
import { obtenerSesion } from "../state/sesion.js";
export function AdminCrearComodidadPage() {
  return `<section class="container py-5 gestion-page"><h1>Crear comodidad</h1>
    <form id="comodidad-form" class="gestion-form"><label for="comodidad-nombre" class="form-label">Nombre</label>
    <input id="comodidad-nombre" name="nombre" maxlength="100" class="form-control mb-3" required>
    <button type="submit" class="btn btn-sand">Crear comodidad</button><p class="mt-3" role="status" data-mensaje></p></form></section>`;
}
export function loadAdminCrearComodidadPage() {
  const form = document.querySelector("#comodidad-form");
  const sesion = obtenerSesion();
  if (!form || !sesion) return;
  const boton = form.querySelector("button");
  const mensaje = form.querySelector("[data-mensaje]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (boton.disabled) return;
    const nombre = form.elements.nombre.value;
    const errores = validarComodidad(nombre);
    if (errores.nombre) { mensaje.textContent = errores.nombre; return; }
    boton.disabled = true;
    mensaje.textContent = "Creando comodidad…";
    try {
      await crearComodidad(nombre, sesion.token);
      form.reset();
      mensaje.textContent = "Comodidad creada correctamente.";
    } catch (error) {
      mensaje.textContent = error.status === 409 ? "Ya existe una comodidad con ese nombre." : error.message;
    } finally { boton.disabled = false; }
  });
}
