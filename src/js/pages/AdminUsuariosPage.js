import { listarUsuarios } from "../api/auth.api.js";
import { obtenerSesion } from "../state/sesion.js";

export function AdminUsuariosPage() {
  return `
    <section class="container py-5">
      <h1 class="mb-4">Usuarios registrados</h1>
      <p id="admin-estado" role="status">Consultando usuarios…</p>

      <div id="admin-tabla" class="table-responsive" hidden>
        <table class="table align-middle">
          <caption class="visually-hidden">Usuarios registrados</caption>
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Correo electrónico</th>
              <th scope="col">Rol</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  `;
}

export async function loadAdminUsuariosPage() {
  const estado = document.querySelector("#admin-estado");
  const tabla = document.querySelector("#admin-tabla");
  const sesion = obtenerSesion();
  if (!estado || !tabla || !sesion) return;

  try {
    const usuarios = await listarUsuarios(sesion.token);

    if (usuarios.length === 0) {
      estado.textContent = "No hay usuarios registrados.";
      return;
    }

    const cuerpo = tabla.querySelector("tbody");
    for (const usuario of usuarios) {
      const fila = cuerpo.insertRow();
      fila.insertCell().textContent = usuario.perfil.nombre;
      fila.insertCell().textContent = usuario.correo;
      fila.insertCell().textContent = usuario.rol;
    }

    tabla.hidden = false;
    estado.hidden = true;
  } catch (error) {
    estado.classList.add("text-danger");
    estado.textContent = error.message;
  }
}