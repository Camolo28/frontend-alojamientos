const CLAVE_SESION = "alojamientos.sesion";

export function guardarSesion(token, usuario) {
  const sesion = { token, usuario };
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function obtenerSesion() {
  const datos = sessionStorage.getItem(CLAVE_SESION);
  if (!datos) return null;

  try {
    const sesion = JSON.parse(datos);
    if (typeof sesion?.token === "string" && sesion.token && sesion.usuario?.id != null) {
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