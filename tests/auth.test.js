import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { guardarSesion, obtenerSesion, cerrarSesion } from "../src/js/state/sesion.js";
import { validarLogin, validarRegistro } from "../src/js/utils/validaciones.js";
import { destinoProtegido } from "../src/js/router/permisos.js";
import { matchRoute } from "../src/js/router/routes.js";
import { request } from "../src/js/api/http.js";
import { registrarUsuario, iniciarSesion, consultarPerfil, listarUsuarios } from "../src/js/api/auth.api.js";
import { Navbar } from "../src/js/components/Navbar.js";

const usuario = { id: 1, correo: "prueba@example.com", rol: "usuario", perfil: { nombre: "Camilo" } };
const originalFetch = globalThis.fetch;
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
const respuesta = (datos, status = 200) => new Response(JSON.stringify(datos), { status });

beforeEach(() => {
  const datos = new Map();
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: {
    getItem: (key) => datos.get(key) ?? null,
    setItem: (key, value) => datos.set(key, String(value)),
    removeItem: (key) => datos.delete(key),
  } });
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalStorage) Object.defineProperty(globalThis, "sessionStorage", originalStorage);
  else delete globalThis.sessionStorage;
});

test("guarda y recupera token y usuario de sessionStorage", () => {
  assert.equal(obtenerSesion(), null);
  guardarSesion("token", usuario);
  assert.deepEqual(obtenerSesion(), { token: "token", usuario });
  assert.equal(JSON.parse(sessionStorage.getItem("alojamientos.sesion")).token, "token");
});
test("el cierre elimina la sesión y actualiza las opciones de Navbar", () => {
  guardarSesion("token", { ...usuario, rol: "admin" });
  assert.match(Navbar(), /Usuarios registrados/);
  assert.match(Navbar(), /cerrar-sesion/);
  cerrarSesion();
  assert.equal(obtenerSesion(), null);
  assert.match(Navbar(), /Iniciar sesión/);
  assert.doesNotMatch(Navbar(), /cerrar-sesion/);
});
test("descarta sesiones dañadas e impide guardar datos incompletos", () => {
  for (const datos of ["{", "null", '{"token":"x","usuario":{"id":1}}']) {
    sessionStorage.setItem("alojamientos.sesion", datos);
    assert.equal(obtenerSesion(), null);
  }
  assert.throws(() => guardarSesion("", usuario));
});
test("valida correo y contraseña de login sin exigir seis caracteres", () => {
  assert.deepEqual(validarLogin({ correo: usuario.correo, contrasena: "x" }), {});
  assert.ok(validarLogin({ correo: "incorrecto", contrasena: "" }).correo);
  assert.ok(validarLogin({ correo: usuario.correo, contrasena: "" }).contrasena);
});
test("registro valida longitud, confirmación y nombre", () => {
  const datos = { correo: usuario.correo, contrasena: "abc123", confirmarContrasena: "abc123" };
  assert.deepEqual(validarRegistro(datos), {});
  assert.ok(validarRegistro({ ...datos, contrasena: "abc" }).contrasena);
  assert.ok(validarRegistro({ ...datos, confirmarContrasena: "otra" }).confirmarContrasena);
  assert.ok(validarRegistro({ ...datos, nombre: "x".repeat(101) }).nombre);
  assert.ok(validarRegistro({ ...datos, contrasena: "x".repeat(129) }).contrasena);
});
test("visitantes acceden a rutas públicas y son redirigidos en rutas privadas", () => {
  for (const path of ["/", "/login", "/registro", "/alojamientos"]) {
    assert.equal(destinoProtegido(matchRoute(path).name, null), null);
  }
  for (const path of ["/perfil", "/admin/usuarios"]) {
    assert.equal(destinoProtegido(matchRoute(path).name, null), "/login");
  }
});
test("solo el rol admin accede a administración y ve su enlace", () => {
  assert.equal(destinoProtegido("perfil", { usuario }), null);
  assert.equal(destinoProtegido("admin-usuarios", { usuario }), "/no-autorizado");
  assert.equal(destinoProtegido("admin-usuarios", { usuario: { ...usuario, rol: "admin" } }), null);
  guardarSesion("token", usuario);
  assert.doesNotMatch(Navbar(), /Usuarios registrados/);
});
test("registro envía POST JSON con campos del backend y omite confirmación", async () => {
  globalThis.fetch = async (url, options) => {
    assert.ok(url.endsWith("/api/v1/usuarios/registro"));
    assert.equal(options.method, "POST");
    assert.equal(options.headers.get("Content-Type"), "application/json");
    assert.deepEqual(JSON.parse(options.body), { nombre: "Camilo", correo: usuario.correo, contrasena: "abc123" });
    return respuesta(usuario, 201);
  };
  assert.deepEqual(await registrarUsuario({ nombre: " Camilo ", correo: usuario.correo, contrasena: "abc123", confirmarContrasena: "abc123" }), usuario);
});
test("login consulta perfil con Bearer antes de guardar la sesión", async () => {
  let llamadas = 0;
  globalThis.fetch = async (url, options) => {
    llamadas++;
    if (url.endsWith("/login")) {
      assert.equal(options.method, "POST");
      return respuesta({ access_token: "jwt" });
    }
    assert.ok(url.endsWith("/perfil"));
    assert.equal(options.headers.get("Authorization"), "Bearer jwt");
    assert.equal(obtenerSesion(), null);
    return respuesta(usuario);
  };
  assert.deepEqual(await iniciarSesion({ correo: usuario.correo, contrasena: "abc123" }), usuario);
  assert.equal(llamadas, 2);
  assert.equal(obtenerSesion().token, "jwt");
});
test("login fallido o perfil fallido no crean sesión", async () => {
  globalThis.fetch = async () => respuesta({ message: "Credenciales incorrectas" }, 401);
  await assert.rejects(iniciarSesion({}), { status: 401 });
  globalThis.fetch = async () => respuesta({});
  await assert.rejects(iniciarSesion({}), /token/);
  globalThis.fetch = async (url) => url.endsWith("/login")
    ? respuesta({ access_token: "jwt" }) : respuesta({}, 500);
  await assert.rejects(iniciarSesion({}), { status: 500 });
  assert.equal(obtenerSesion(), null);
});
test("perfil y listado administrativo envían Bearer y leen el contrato real", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(options.headers.get("Authorization"), "Bearer jwt");
    return respuesta(url.endsWith("/perfil") ? usuario : { usuarios: [usuario] });
  };
  assert.deepEqual(await consultarPerfil("jwt"), usuario);
  assert.deepEqual(await listarUsuarios("jwt"), [usuario]);
});
test("HTTP conserva estados 400, 403 y 409 y mensajes del backend", async () => {
  guardarSesion("jwt", usuario);
  for (const status of [400, 403, 409]) {
    globalThis.fetch = async () => respuesta({ error: { message: "Mensaje de prueba" } }, status);
    await assert.rejects(request("/prueba", { token: "jwt" }), { status, message: "Mensaje de prueba" });
    assert.equal(obtenerSesion().token, "jwt");
  }
});
test("401 elimina la sesión vigente pero una respuesta antigua no borra una nueva", async () => {
  guardarSesion("nuevo", usuario);
  globalThis.fetch = async () => respuesta({}, 401);
  await assert.rejects(request("/perfil", { token: "anterior" }), { status: 401 });
  assert.equal(obtenerSesion().token, "nuevo");
  await assert.rejects(request("/perfil", { token: "nuevo" }), { status: 401 });
  assert.equal(obtenerSesion(), null);
});
test("HTTP distingue fallos de red, JSON inválido y respuesta vacía", async () => {
  globalThis.fetch = async () => { throw new TypeError("Failed to fetch"); };
  await assert.rejects(request("/health"), /conectar/);
  globalThis.fetch = async () => new Response("html", { status: 200 });
  await assert.rejects(request("/health"), /formato/);
  globalThis.fetch = async () => new Response(null, { status: 204 });
  assert.equal(await request("/health"), null);
});
