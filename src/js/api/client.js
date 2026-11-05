const configuredBaseUrl = import.meta.env?.VITE_API_URL || "http://localhost:5000";

export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, "");

export function buildApiUrl(path) {
  return `${API_BASE_URL}/${String(path).replace(/^\/+/, "")}`;
}

export async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(buildApiUrl(path), {
      ...options,
      headers: { Accept: "application/json", ...options.headers },
    });
  } catch (error) {
    throw new Error("No fue posible conectar con el servidor. Verifica que la API esté activa.", {
      cause: error,
    });
  }

  if (!response.ok) {
    throw new Error(`La API respondió con el estado ${response.status}.`);
  }

  if (response.status === 204) return null;

  try {
    return await response.json();
  } catch (error) {
    throw new Error("El servidor respondió con un formato que no se pudo leer.", {
      cause: error,
    });
  }
}
