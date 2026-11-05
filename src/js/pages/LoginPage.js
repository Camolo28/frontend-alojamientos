import { iniciarSesion } from "../api/auth.api.js";
import { validarLogin } from "../utils/validaciones.js";
import { navigate } from "../router/router.js";

export function LoginPage() {
  return `
    <section class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <h1 class="mb-4">Iniciar sesión</h1>

          <form id="form-login">
            <div class="mb-3">
              <label for="login-correo" class="form-label">Correo electrónico</label>
              <input id="login-correo" name="correo" class="form-control"
                type="email" maxlength="254" autocomplete="username" required>
            </div>

            <div class="mb-4">
              <label for="login-contrasena" class="form-label">Contraseña</label>
              <input id="login-contrasena" name="contrasena" class="form-control"
                type="password" maxlength="128" autocomplete="current-password" required>
            </div>

            <button type="submit" class="btn btn-sand rounded-pill px-4">
              Iniciar sesión
            </button>
            <p id="login-mensaje" class="mt-3 mb-0" role="status"></p>
          </form>

          <a href="/registro" data-link class="text-link">Crear una cuenta</a>
        </div>
      </div>
    </section>
  `;
}

export function loadLoginPage() {
  const form = document.querySelector("#form-login");
  if (!form) return;

  const boton = form.querySelector('button[type="submit"]');
  const mensaje = form.querySelector("#login-mensaje");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (boton.disabled) return;

    const datos = Object.fromEntries(new FormData(form));
    const [primerError] = Object.entries(validarLogin(datos));

    if (primerError) {
      const [campo, texto] = primerError;
      mensaje.className = "mt-3 mb-0 text-danger";
      mensaje.textContent = texto;
      form.elements.namedItem(campo)?.focus();
      return;
    }

    boton.disabled = true;
    mensaje.className = "mt-3 mb-0 text-body-secondary";
    mensaje.textContent = "Verificando tus datos…";

    try {
      await iniciarSesion(datos);
      navigate("/perfil");
    } catch (error) {
      mensaje.className = "mt-3 mb-0 text-danger";
      mensaje.textContent = error.status === 401
        ? "No se pudo iniciar sesión. Revisa tu correo y contraseña."
        : error.message;
    } finally {
      boton.disabled = false;
    }
  });
}