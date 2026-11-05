import { escapeHtml } from "../utils/html.js";
export function ComodidadesSelector(comodidades, seleccionadas = []) {
  const ids = new Set(seleccionadas.map(String));
  return `<fieldset class="comodidades-selector"><legend class="h5">Comodidades</legend>
    ${comodidades.length ? comodidades.map((item) => `<label class="form-check">
      <input class="form-check-input" type="checkbox" name="comodidades" value="${escapeHtml(item.id)}" ${ids.has(String(item.id)) ? "checked" : ""}>
      <span class="form-check-label">${escapeHtml(item.nombre)}</span></label>`).join("") : '<p>No hay comodidades disponibles.</p>'}
    </fieldset>`;
}
export function leerComodidades(form) {
  return Array.from(form.querySelectorAll('input[name="comodidades"]:checked'), (input) => Number(input.value));
}
