import { matchRoute } from "../router/routes.js";

export function normalizarAlojamiento(datos) {
  return {
    titulo: String(datos.titulo ?? "").trim(),
    descripcion: String(datos.descripcion ?? "").trim(),
    ciudad: String(datos.ciudad ?? "").trim(),
    precio_por_noche: Number(String(datos.precio_por_noche ?? "").trim()),
  };
}
export function puedeGestionar(alojamiento, usuario) {
  if (!usuario || usuario.id == null || !alojamiento) return false;
  return usuario.rol === "admin" || (alojamiento.usuario_id != null &&
    String(alojamiento.usuario_id) === String(usuario.id));
}
export function filtrarPropios(alojamientos, usuarioId) {
  if (usuarioId == null) return [];
  return alojamientos.filter((item) => item.usuario_id != null && String(item.usuario_id) === String(usuarioId));
}
export function obtenerAlojamiento(payload) {
  return payload?.data?.alojamiento ?? payload?.data ?? payload?.alojamiento ?? payload?.result ?? payload;
}
export function destinoLocalPermitido(destino) {
  if (typeof destino !== "string" || !destino.startsWith("/") || destino.startsWith("//") ||
      /[\\%?#\s]/.test(destino)) return "/perfil";
  const ruta = matchRoute(destino);
  if (["not-found", "login", "registro", "no-autorizado"].includes(ruta.name)) return "/perfil";
  return destino;
}
