const CLAVE_SESION = "alojamientos.sesion";

export function guardarSesion(token, usuario) {
  if (typeof token !== "string" || !token.trim() || usuario?.id == null ||
      typeof usuario.correo !== "string" || typeof usuario.rol !== "string") {
    throw new Error("El servidor devolvió datos de sesión incompletos.");
  }
  const sesion = { token, usuario };
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function obtenerSesion() {
  const datos = sessionStorage.getItem(CLAVE_SESION);
  if (!datos) return null;

  try {
    const sesion = JSON.parse(datos);
    if (typeof sesion?.token === "string" && sesion.token.trim() && sesion.usuario?.id != null && typeof sesion.usuario.correo === "string" && typeof sesion.usuario.rol === "string") {
      return sesion;
    }
  } catch {
    // Una sesión ilegible se trata como una sesión cerrada.
  }

  cerrarSesion();
  return null;
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
}