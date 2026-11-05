import { request } from "./client.js";

export function getHealth() {
  return request("/health");
}

export function getAlojamientos() {
  return request("/api/v1/alojamientos");
}

export function getAlojamiento(id) {
  return request(`/api/v1/alojamientos/${encodeURIComponent(id)}`);
}

export function getComodidades() {
  return request("/api/v1/comodidades");
}
