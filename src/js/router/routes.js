export const routes = [
  { pattern: /^\/$/, name: "home" },
  { pattern: /^\/alojamientos\/?$/, name: "alojamientos" },
  { pattern: /^\/alojamientos\/([^/]+)\/?$/, name: "detalle" },
  { pattern: /^\/comodidades\/?$/, name: "comodidades" },
  { pattern: /^\/estado-api\/?$/, name: "estado-api" },
];

export function matchRoute(path) {
  for (const route of routes) {
    const match = path.match(route.pattern);
    if (match) return { name: route.name, params: match.slice(1) };
  }
  return { name: "not-found", params: [] };
}
