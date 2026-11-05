import { cerrarSesion, obtenerSesion } from "../state/sesion.js";

const configuredBaseUrl = import.meta.env?.VITE_API_URL || "http://localhost:5000";
export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, "");

export function buildApiUrl(path) {
  return `${API_BASE_URL}/${String(path).replace(/^\/+/, "")}`;
}

const mensajesHTTP = {
  400: "Revisa los datos enviados.",
  401: "Las credenciales o el token son inválidos.",
  403: "Tu usuario no tiene permiso para acceder.",
  404: "El recurso solicitado no existe o fue eliminado.",
  409: "Los datos enviados entran en conflicto con un registro existente.",
};

export async function request(path, options = {}) {
  const { json, token, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
    fetchOptions.body = JSON.stringify(json);
  }

  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(buildApiUrl(path), { ...fetchOptions, headers });
  } catch (cause) {
    throw new Error("No fue posible conectar con el servidor. Verifica que la API esté activa.", {
      cause,
    });
  }

  if (!response.ok) {
    if (response.status === 401 && token && obtenerSesion()?.token === token) {
      cerrarSesion();
      globalThis.window?.dispatchEvent(new Event("sesion-expirada"));
    }

    const datos = await response.json().catch(() => null);
    const mensaje = [datos?.mensaje, datos?.message, datos?.error?.message, datos?.error?.mensaje, datos?.error]
      .find((valor) => typeof valor === "string" && valor.trim());

    const error = new Error(
      mensaje || mensajesHTTP[response.status] || `La API respondió con el estado ${response.status}.`
    );
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;

  try {
    return await response.json();
  } catch (cause) {
    throw new Error("El servidor respondió con un formato que no se pudo leer.", { cause });
  }
}