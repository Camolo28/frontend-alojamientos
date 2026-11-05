import test from "node:test";
import assert from "node:assert/strict";
import {
  escapeHtml,
  filterAlojamientos,
  formatCop,
  safeImageUrl,
  unwrapCollection,
} from "../src/js/utils/html.js";
import { matchRoute } from "../src/js/router/routes.js";

test("escapa texto que podría interpretarse como HTML", () => {
  assert.equal(escapeHtml(`<script title="x">'&</script>`), "&lt;script title=&quot;x&quot;&gt;&#39;&amp;&lt;/script&gt;");
  assert.equal(safeImageUrl("javascript:alert(1)"), "");
});

test("acepta una colección JSON que ya es un arreglo", () => {
  const rows = [{ id: 1 }, { id: 2 }];
  assert.equal(unwrapCollection(rows), rows);
});

test("lee colecciones dentro de data con la clave del recurso", () => {
  const rows = [{ id: 1 }];
  assert.equal(unwrapCollection({ success: true, data: { alojamientos: rows } }, ["alojamientos"]), rows);
});

test("presenta precios en pesos colombianos", () => {
  assert.match(formatCop(45000), /45\.000/);
});

test("filtra alojamientos por título sin distinguir mayúsculas", () => {
  const stays = [{ titulo: "Casa del Río", ciudad: "Santa Fe" }, { titulo: "Finca Verde", ciudad: "Jardín" }];
  assert.deepEqual(filterAlojamientos(stays, "CASA"), [stays[0]]);
});

test("filtra alojamientos por ciudad", () => {
  const stays = [{ titulo: "Casa del Río", ciudad: "Santa Fe" }, { titulo: "Finca Verde", ciudad: "Jardín" }];
  assert.deepEqual(filterAlojamientos(stays, "jardín"), [stays[1]]);
});

test("identifica la ruta inicial", () => {
  assert.deepEqual(matchRoute("/"), { name: "home", params: [] });
});

test("identifica el detalle y conserva su id", () => {
  assert.deepEqual(matchRoute("/alojamientos/27"), { name: "detalle", params: ["27"] });
});

test("envía las rutas desconocidas a la página 404", () => {
  assert.deepEqual(matchRoute("/ruta-que-no-existe"), { name: "not-found", params: [] });
});

