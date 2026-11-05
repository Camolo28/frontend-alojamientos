export function destinoProtegido(nombre, sesion) {
  const privadas = ["perfil", "admin-usuarios", "mis-alojamientos", "crear-alojamiento", "editar-alojamiento", "crear-comodidad"];
  if (!privadas.includes(nombre)) return null;
  if (!sesion) return "/login";
  if (["admin-usuarios", "crear-comodidad"].includes(nombre) && sesion.usuario.rol !== "admin") return "/no-autorizado";
  return null;
}
