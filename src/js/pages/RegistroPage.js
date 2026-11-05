import { registrarUsuario } from "../api/auth.api.js";
import { validarRegistro } from "../utils/validaciones.js";

export function RegistroPage() {
  return `
    <section class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <h1 class="mb-4">Crear cuenta</h1>

          <form id="form-registro">
            <div class="mb-3">
              <label for="registro-nombre" class="form-label">Nombre (opcional)</label>
              <input id="registro-nombre" name="nombre" class="form-control"
                type="text" maxlength="100" autocomplete="name">
            </div>

            <div class="mb-3">
              <label for="registro-correo" class="form-label">Correo electrónico</label>
              <input id="registro-correo" name="correo" class="form-control"
                type="email" maxlength="254" autocomplete="email" required>
            </div>

            <div class="mb-3">
              <label for="registro-contrasena" class="form-label">Contraseña</label>
              <input id="registro-contrasena" name="contrasena" class="form-control"
                type="password" minlength="6" maxlength="128"
                autocomplete="new-password" aria-describedby="ayuda-contrasena" required>
              <div id="ayuda-contrasena" class="form-text">Usa entre 6 y 128 caracteres.</div>
            </div>

            <div class="mb-4">
              <label for="registro-confirmacion" class="form-label">Confirmar contraseña</label>
              <input id="registro-confirmacion" name="confirmarContrasena" class="form-control"
                type="password" maxlength="128" autocomplete="new-password" required>
            </div>

            <button type="submit" class="btn btn-sand rounded-pill px-4">Crear cuenta</button>
            <p id="registro-mensaje" class="mt-3 mb-0" role="status"></p>
          </form>
        </div>
      </div>
    </section>
  `;
}

export function loadRegistroPage() {
  const form = document.querySelector("#form-registro");
  if (!form) return;

  const boton = form.querySelector('button[type="submit"]');
  const mensaje = form.querySelector("#registro-mensaje");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (boton.disabled) return;

    const datos = Object.fromEntries(new FormData(form));
    const errores = Object.entries(validarRegistro(datos));

    if (errores.length > 0) {
      const [campo, texto] = errores[0];
      mensaje.className = "mt-3 mb-0 text-danger";
      mensaje.textContent = texto;
      form.elements.namedItem(campo)?.focus();
      return;
    }

    boton.disabled = true;
    mensaje.className = "mt-3 mb-0 text-body-secondary";
    mensaje.textContent = "Creando tu cuenta…";

    try {
      await registrarUsuario(datos);
      form.reset();
      mensaje.className = "mt-3 mb-0 text-success";
      mensaje.textContent = "Cuenta creada. Ya puedes iniciar sesión.";
    } catch (error) {
      mensaje.className = "mt-3 mb-0 text-danger";
      mensaje.textContent = error.status === 409
        ? "Ese correo ya está registrado. Puedes iniciar sesión con él."
        : error.message;
    } finally {
      boton.disabled = false;
    }
  });
}