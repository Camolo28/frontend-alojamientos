import { consultarPerfil } from "../api/auth.api.js";
import { obtenerSesion } from "../state/sesion.js";

export function PerfilPage() {
  return `
    <section class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <h1 class="mb-4">Mi perfil</h1>
          <p id="perfil-estado" role="status">Consultando tu perfil…</p>

          <dl id="perfil-datos" class="card p-4" hidden>
            <dt>Nombre</dt>
            <dd id="perfil-nombre"></dd>
            <dt>Correo electrónico</dt>
            <dd id="perfil-correo"></dd>
            <dt>Rol</dt>
            <dd id="perfil-rol" class="mb-0"></dd>
          </dl>
        </div>
      </div>
    </section>
  `;
}

export async function loadPerfilPage() {
  const estado = document.querySelector("#perfil-estado");
  const datos = document.querySelector("#perfil-datos");
  const sesion = obtenerSesion();
  if (!estado || !datos || !sesion) return;

  try {
    const usuario = await consultarPerfil(sesion.token);
    datos.querySelector("#perfil-nombre").textContent = usuario.perfil.nombre;
    datos.querySelector("#perfil-correo").textContent = usuario.correo;
    datos.querySelector("#perfil-rol").textContent = usuario.rol;
    datos.hidden = false;
    estado.hidden = true;
  } catch (error) {
    estado.classList.add("text-danger");
    estado.textContent = error.status === 401
      ? "Tu sesión ya no es válida. Vuelve a iniciar sesión."
      : error.message;
  }
}   