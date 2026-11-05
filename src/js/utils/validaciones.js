function validarCorreo(correo) {
  const valor = correo.trim();
  return valor.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

export function validarLogin({ correo = "", contrasena = "" }) {
  const errores = {};

  if (!validarCorreo(correo)) {
    errores.correo = "Ingresa un correo electrónico válido.";
  }

  if (contrasena.length < 1 || contrasena.length > 128) {
    errores.contrasena = "Ingresa una contraseña de hasta 128 caracteres.";
  }

  return errores;
}

export function validarRegistro({
  nombre = "",
  correo = "",
  contrasena = "",
  confirmarContrasena = "",
}) {
  const errores = validarLogin({ correo, contrasena });

  if (nombre.trim().length > 100) {
    errores.nombre = "El nombre debe tener máximo 100 caracteres.";
  }

  if (contrasena.length < 6 || contrasena.length > 128) {
    errores.contrasena = "La contraseña debe tener entre 6 y 128 caracteres.";
  }

  if (confirmarContrasena !== contrasena) {
    errores.confirmarContrasena = "Las contraseñas deben coincidir.";
  }

  return errores;
}