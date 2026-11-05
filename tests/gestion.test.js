import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { crearAlojamiento, actualizarAlojamiento, eliminarAlojamiento, asignarComodidades } from "../src/js/api/alojamientos.api.js";
import { crearComodidad } from "../src/js/api/comodidades.api.js";
import { normalizarAlojamiento, puedeGestionar, filtrarPropios, destinoLocalPermitido } from "../src/js/utils/gestion.js";
import { validarAlojamiento, validarComodidad } from "../src/js/utils/validaciones.js";
import { matchRoute } from "../src/js/router/routes.js";
import { destinoProtegido } from "../src/js/router/permisos.js";
import { AlojamientoForm } from "../src/js/components/AlojamientoForm.js";
import { ComodidadesSelector, leerComodidades } from "../src/js/components/ComodidadesSelector.js";

const originalFetch = globalThis.fetch;
const datos = { titulo: "Casa", descripcion: "Una casa", ciudad: "Medellín", precio_por_noche: 120000 };
let llamadas;
beforeEach(() => {
  llamadas = [];
  globalThis.fetch = async (url, options) => {
    llamadas.push({ url, ...options });
    if (options.method === "DELETE") return new Response(null, { status: 204 });
    return new Response(JSON.stringify({ id: 9, ...datos }), { status: options.method === "POST" ? 201 : 200 });
  };
});
afterEach(() => { globalThis.fetch = originalFetch; });

test("crear alojamiento usa POST, Bearer y los cuatro campos", async () => {
  assert.equal((await crearAlojamiento(datos, "jwt")).id, 9);
  assert.ok(llamadas[0].url.endsWith("/api/v1/alojamientos"));
  assert.equal(llamadas[0].method, "POST");
  assert.equal(llamadas[0].headers.get("Authorization"), "Bearer jwt");
  assert.deepEqual(JSON.parse(llamadas[0].body), datos);
});
test("editar alojamiento usa PATCH y codifica el identificador", async () => {
  await actualizarAlojamiento("a/b", datos, "jwt");
  assert.ok(llamadas[0].url.endsWith("/alojamientos/a%2Fb"));
  assert.equal(llamadas[0].method, "PATCH");
  assert.deepEqual(JSON.parse(llamadas[0].body), datos);
});
test("eliminar procesa 204 sin intentar leer JSON", async () => {
  assert.equal(await eliminarAlojamiento(9, "jwt"), null);
  assert.equal(llamadas[0].method, "DELETE");
  assert.equal(llamadas[0].headers.get("Authorization"), "Bearer jwt");
});
test("comodidades envía selección completa y permite retirar todas", async () => {
  await asignarComodidades(9, [1, 2], "jwt");
  await asignarComodidades(9, [], "jwt");
  assert.deepEqual(JSON.parse(llamadas[0].body), { comodidades_ids: [1, 2] });
  assert.deepEqual(JSON.parse(llamadas[1].body), { comodidades_ids: [] });
  assert.ok(llamadas[0].url.endsWith("/alojamientos/9/comodidades"));
  assert.equal(llamadas[0].method, "PATCH");
});
test("crear comodidad usa el endpoint existente y normaliza nombre", async () => {
  await crearComodidad(" Wifi ", "jwt");
  assert.ok(llamadas[0].url.endsWith("/api/v1/comodidades"));
  assert.deepEqual(JSON.parse(llamadas[0].body), { nombre: "Wifi" });
  assert.equal(llamadas[0].headers.get("Authorization"), "Bearer jwt");
});
test("validación rechaza textos vacíos y precios inválidos", () => {
  assert.deepEqual(validarAlojamiento(datos), {});
  for (const precio of ["", " ", "abc", Infinity, -1, 0]) assert.ok(validarAlojamiento({ ...datos, precio_por_noche: precio }).precio_por_noche);
  for (const campo of ["titulo", "descripcion", "ciudad"]) assert.ok(validarAlojamiento({ ...datos, [campo]: " " })[campo]);
});
test("normalización produce JSON numérico sin campos de propietario", () => {
  assert.deepEqual(normalizarAlojamiento({ titulo: " Casa ", descripcion: " Una casa ", ciudad: " Medellín ", precio_por_noche: "120000", usuario_id: 99 }), datos);
});
test("permisos visuales distinguen propietario, administrador y terceros", () => {
  assert.equal(puedeGestionar({ usuario_id: 2 }, { id: "2", rol: "usuario" }), true);
  assert.equal(puedeGestionar({ usuario_id: 2 }, { id: 3, rol: "admin" }), true);
  assert.equal(puedeGestionar({ usuario_id: 2 }, { id: 3, rol: "usuario" }), false);
  assert.equal(puedeGestionar({}, null), false);
  assert.equal(puedeGestionar({}, { id: 1, rol: "usuario" }), false);
});
test("mis alojamientos filtra por usuario_id incluso con ids de distinto tipo", () => {
  const items = [{ id: 1, usuario_id: 2 }, { id: 2, usuario_id: "3" }, { id: 3 }];
  assert.deepEqual(filtrarPropios(items, 3), [items[1]]);
  assert.deepEqual(filtrarPropios(items, null), []);
});
test("rutas específicas preceden al detalle y tienen permisos correctos", () => {
  assert.equal(matchRoute("/alojamientos/nuevo").name, "crear-alojamiento");
  assert.deepEqual(matchRoute("/alojamientos/9/editar"), { name: "editar-alojamiento", params: ["9"] });
  for (const path of ["/alojamientos/nuevo", "/mis-alojamientos", "/alojamientos/9/editar", "/admin/comodidades/nueva"]) assert.equal(destinoProtegido(matchRoute(path).name, null), "/login");
  assert.equal(destinoProtegido("crear-comodidad", { usuario: { rol: "usuario" } }), "/no-autorizado");
  assert.equal(destinoProtegido("crear-comodidad", { usuario: { rol: "admin" } }), null);
});
test("retorno de login permite rutas conocidas y bloquea destinos externos", () => {
  assert.equal(destinoLocalPermitido("/alojamientos/9/editar"), "/alojamientos/9/editar");
  for (const path of [null, "https://otro.com", "//otro.com", "/\\otro.com", "/%2f%2fotro.com", "/login", "/inexistente"]) assert.equal(destinoLocalPermitido(path), "/perfil");
});
test("formulario reutilizable escapa datos y contiene campos editables", () => {
  const html = AlojamientoForm({ ...datos, titulo: '"><script>alert(1)</script>', descripcion: "</textarea><img>" });
  assert.doesNotMatch(html, /<script>|<img>/);
  for (const campo of Object.keys(datos)) assert.ok(html.includes(`name="${campo}"`));
  assert.match(html, /type="submit"/);
});
test("selector marca selección, escapa nombres y lee ids numéricos", () => {
  const html = ComodidadesSelector([{ id: 2, nombre: "<img>" }], ["2"]);
  assert.match(html, /checked/);
  assert.match(html, /&lt;img&gt;/);
  assert.deepEqual(leerComodidades({ querySelectorAll: () => [{ value: "2" }] }), [2]);
  assert.match(ComodidadesSelector([]), /No hay comodidades/);
  assert.ok(validarComodidad(" ").nombre);
  assert.deepEqual(validarComodidad("Wifi"), {});
});
test("CRUD propaga errores 400, 403, 404 y 409 con estado y mensaje", async () => {
  for (const status of [400, 403, 404, 409]) {
    globalThis.fetch = async () => new Response(JSON.stringify({ message: "Operación rechazada" }), { status });
    await assert.rejects(actualizarAlojamiento(9, datos, "jwt"), { status, message: "Operación rechazada" });
  }
});
