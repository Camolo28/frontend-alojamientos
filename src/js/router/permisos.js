export function destinoProtegido(nombre, sesion) {
  if (!["perfil", "admin-usuarios"].includes(nombre)) return null;
  if (!sesion) return "/login";
  if (nombre === "admin-usuarios" && sesion.usuario.rol !== "admin") {
    return "/no-autorizado";
  }
  return null;
}
