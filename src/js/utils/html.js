export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export function getFirstValue(record, keys, fallback = "") {
  for (const key of keys) {
    const value = record?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
}

export function safeImageUrl(value) {
  if (!value) return "";
  const candidate = String(value).trim();
  if (candidate.startsWith("/")) return candidate;
  try {
    const parsed = new URL(candidate, globalThis.location?.origin || "http://localhost");
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
}

export function unwrapCollection(payload, keys = []) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const containers = [payload, payload.data, payload.result, payload.results];
  for (const container of containers) {
    if (Array.isArray(container)) return container;
    if (!container || typeof container !== "object") continue;
    for (const key of keys) {
      if (Array.isArray(container[key])) return container[key];
    }
    if (Array.isArray(container.items)) return container.items;
  }
  return [];
}

export function formatCop(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Precio por consultar";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function filterAlojamientos(alojamientos, term) {
  const query = String(term ?? "").trim().toLocaleLowerCase("es");
  if (!query) return alojamientos;
  return alojamientos.filter((alojamiento) => {
    const title = getFirstValue(alojamiento, ["titulo", "nombre", "title", "name"]);
    const city = getFirstValue(alojamiento, ["ciudad", "city", "municipio"]);
    return `${title} ${city}`.toLocaleLowerCase("es").includes(query);
  });
}
