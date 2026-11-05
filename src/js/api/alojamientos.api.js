import { request } from "./http.js";

export function crearAlojamiento(datos, token) {
  return request("/api/v1/alojamientos", { method: "POST", json: datos, token });
}
export function actualizarAlojamiento(id, datos, token) {
  return request(`/api/v1/alojamientos/${encodeURIComponent(id)}`, { method: "PATCH", json: datos, token });
}
export function eliminarAlojamiento(id, token) {
  return request(`/api/v1/alojamientos/${encodeURIComponent(id)}`, { method: "DELETE", token });
}
export function asignarComodidades(id, comodidades_ids, token) {
  return request(`/api/v1/alojamientos/${encodeURIComponent(id)}/comodidades`, {
    method: "PATCH", json: { comodidades_ids }, token,
  });
}
