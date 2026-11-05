import { request } from "./http.js";
export function crearComodidad(nombre, token) {
  return request("/api/v1/comodidades", { method: "POST", json: { nombre: nombre.trim() }, token });
}
