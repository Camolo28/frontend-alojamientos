import { CrearAlojamientoPage, loadCrearAlojamientoPage } from "../pages/CrearAlojamientoPage.js";
import { MisAlojamientosPage, loadMisAlojamientosPage } from "../pages/MisAlojamientosPage.js";
import { EditarAlojamientoPage, loadEditarAlojamientoPage } from "../pages/EditarAlojamientoPage.js";
import { AdminCrearComodidadPage, loadAdminCrearComodidadPage } from "../pages/AdminCrearComodidadPage.js";
import { destinoProtegido } from "./permisos.js";
import { PerfilPage, loadPerfilPage } from "../pages/PerfilPage.js";
import { cerrarSesion, obtenerSesion } from "../state/sesion.js";
import { Footer } from "../components/Footer.js";
import { RegistroPage, loadRegistroPage } from "../pages/RegistroPage.js";
import { LoginPage, loadLoginPage } from "../pages/LoginPage.js";
import { Navbar } from "../components/Navbar.js";
import { AlojamientosPage, loadAlojamientosPage } from "../pages/AlojamientosPage.js";
import { ComodidadesPage, loadComodidadesPage } from "../pages/ComodidadesPage.js";
import { DetallePage, loadDetallePage } from "../pages/DetallePage.js";
import { EstadoApiPage, loadEstadoApiPage } from "../pages/EstadoApiPage.js";
import { HomePage, loadHomePage } from "../pages/HomePage.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
import { matchRoute } from "./routes.js";
import { AdminUsuariosPage, loadAdminUsuariosPage } from "../pages/AdminUsuariosPage.js";
import { NoAutorizadoPage } from "../pages/NoAutorizadoPage.js";

const pageDefinitions = {
  "crear-alojamiento": { title: "Publicar alojamiento", path: "/alojamientos/nuevo", render: CrearAlojamientoPage, load: loadCrearAlojamientoPage },
  "mis-alojamientos": { title: "Mis alojamientos", path: "/mis-alojamientos", render: MisAlojamientosPage, load: loadMisAlojamientosPage },
  "editar-alojamiento": { title: "Editar alojamiento", path: "/mis-alojamientos", render: EditarAlojamientoPage, load: loadEditarAlojamientoPage },
  "crear-comodidad": { title: "Crear comodidad", path: "/admin/comodidades/nueva", render: AdminCrearComodidadPage, load: loadAdminCrearComodidadPage },
  home: { title: "Inicio", path: "/", render: HomePage, load: loadHomePage },
  alojamientos: { title: "Alojamientos", path: "/alojamientos", render: AlojamientosPage, load: loadAlojamientosPage },
  detalle: { title: "Detalle de alojamiento", path: "/alojamientos", render: DetallePage, load: loadDetallePage },
  comodidades: { title: "Comodidades", path: "/comodidades", render: ComodidadesPage, load: loadComodidadesPage },
  "estado-api": { title: "Estado de API", path: "/estado-api", render: EstadoApiPage, load: loadEstadoApiPage },
  "not-found": { title: "Página no encontrada", path: "", render: NotFoundPage },

  registro: {
  title: "Crear cuenta",
  path: "/registro",
  render: RegistroPage,
  load: loadRegistroPage,},

    login: {
    title: "Iniciar sesión",
    path: "/login",
    render: LoginPage,
    load: loadLoginPage,
  },

    perfil: {
    title: "Mi perfil",
    path: "/perfil",
    render: PerfilPage,
    load: loadPerfilPage,
  },

    "admin-usuarios": {
    title: "Usuarios registrados",
    path: "/admin/usuarios",
    render: AdminUsuariosPage,
    load: loadAdminUsuariosPage,
  },
  "no-autorizado": {
    title: "Acceso restringido",
    path: "/no-autorizado",
    render: NoAutorizadoPage,
  },


};

export function router() {
  const app = document.querySelector("#app");
  if (!app) return;
  const path = window.location.pathname;
    let route = matchRoute(path);

    const sesion = obtenerSesion();
  const destino = destinoProtegido(route.name, sesion);

  if (destino) {
    window.history.replaceState({}, "", destino === "/login" ? `/login?next=${encodeURIComponent(path)}` : destino);
    route = matchRoute(destino);
  }

  const page = pageDefinitions[route.name];

  document.title = `${page.title} | Refugio`;
  app.innerHTML = `
    <div class="app-shell">
      ${Navbar(page.path)}
      <main id="main-content" tabindex="-1">${page.render()}</main>
      ${Footer()}
    </div>
  `;
  
    app.querySelector("#cerrar-sesion")?.addEventListener("click", () => {
    cerrarSesion();
    window.history.replaceState({}, "", "/");
    router();
  });

  if (page.load) page.load(...route.params);
  window.bootstrap?.Collapse.getOrCreateInstance(document.querySelector("#mainNavigation"))?.hide();
}

export function navigate(path) {
  if (!path || path === `${window.location.pathname}${window.location.search}${window.location.hash}`) return;
  window.history.pushState({}, "", path);
  router();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function handleDocumentClick(event) {
  const link = event.target.closest("a[data-link]");
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank") return;
  const destination = new URL(link.href, window.location.origin);
  if (destination.origin !== window.location.origin) return;
  event.preventDefault();
  navigate(`${destination.pathname}${destination.search}${destination.hash}`);
}
