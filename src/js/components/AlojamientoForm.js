import { escapeHtml } from "../utils/html.js";
import { validarAlojamiento } from "../utils/validaciones.js";
import { normalizarAlojamiento } from "../utils/gestion.js";

export function AlojamientoForm(alojamiento = {}, boton = "Guardar alojamiento") {
  return `<form id="alojamiento-form" class="gestion-form">
    <label for="titulo" class="form-label">Título</label>
    <input id="titulo" name="titulo" maxlength="200" class="form-control mb-3" required value="${escapeHtml(alojamiento.titulo ?? "")}">
    <label for="descripcion" class="form-label">Descripción</label>
    <textarea id="descripcion" name="descripcion" maxlength="10000" class="form-control mb-3" rows="5" required>${escapeHtml(alojamiento.descripcion ?? "")}</textarea>
    <label for="ciudad" class="form-label">Ciudad</label>
    <input id="ciudad" name="ciudad" maxlength="100" class="form-control mb-3" required value="${escapeHtml(alojamiento.ciudad ?? "")}">
    <label for="precio_por_noche" class="form-label">Precio por noche (COP)</label>
    <input id="precio_por_noche" name="precio_por_noche" type="number" min="0.01" max="9999999999.99" step="0.01" class="form-control mb-4" required value="${escapeHtml(alojamiento.precio_por_noche ?? "")}">
    <button class="btn btn-sand" type="submit">${escapeHtml(boton)}</button>
    <p class="mt-3" role="status" data-mensaje></p>
  </form>`;
}

export function conectarAlojamientoForm(form, guardar) {
  const boton = form.querySelector("button");
  const mensaje = form.querySelector("[data-mensaje]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (boton.disabled) return;
    const datos = Object.fromEntries(new FormData(form));
    const error = Object.entries(validarAlojamiento(datos))[0];
    mensaje.className = "mt-3 text-danger";
    if (error) {
      mensaje.textContent = error[1];
      form.elements.namedItem(error[0]).focus();
      return;
    }
    boton.disabled = true;
    mensaje.textContent = "Guardando…";
    try {
      await guardar(normalizarAlojamiento(datos));
      mensaje.className = "mt-3 text-success";
      mensaje.textContent = "Datos del alojamiento guardados.";
    } catch (error) {
      mensaje.textContent = error.message;
    } finally {
      boton.disabled = false;
    }
  });
}
