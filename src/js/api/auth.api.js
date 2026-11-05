import { request } from "./http.js";
import { guardarSesion } from "../state/sesion.js";

export function registrarUsuario({ nombre, correo, contrasena }) {
  const datos = { correo, contrasena };
  if (nombre?.trim()) datos.nombre = nombre.trim();

  return request("/api/v1/usuarios/registro", {
    method: "POST",
    json: datos,
  });
}

export function consultarPerfil(token) {
  return request("/api/v1/usuarios/perfil", { token });
}

export async function iniciarSesion({ correo, contrasena }) {
  const respuesta = await request("/api/v1/usuarios/login", {
    method: "POST",
    json: { correo, contrasena },
  });

  const token = respuesta?.access_token;
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("El servidor no devolvió un token de acceso válido.");
  }

  const usuario = await consultarPerfil(token);
  guardarSesion(token, usuario);
  return usuario;
}

export async function listarUsuarios(token) {
  const respuesta = await request("/api/v1/admin/usuarios", { token });
  if (!Array.isArray(respuesta?.usuarios)) {
    throw new Error("El servidor devolvió un listado de usuarios inválido.");
  }
  return respuesta.usuarios;
}