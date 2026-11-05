import { Footer } from "../components/Footer.js";
import { Navbar } from "../components/Navbar.js";
import { AlojamientosPage, loadAlojamientosPage } from "../pages/AlojamientosPage.js";
import { ComodidadesPage, loadComodidadesPage } from "../pages/ComodidadesPage.js";
import { DetallePage, loadDetallePage } from "../pages/DetallePage.js";
import { EstadoApiPage, loadEstadoApiPage } from "../pages/EstadoApiPage.js";
import { HomePage, loadHomePage } from "../pages/HomePage.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
import { matchRoute } from "./routes.js";

const pageDefinitions = {
  home: { title: "Inicio", path: "/", render: HomePage, load: loadHomePage },
  alojamientos: { title: "Alojamientos", path: "/alojamientos", render: AlojamientosPage, load: loadAlojamientosPage },
  detalle: { title: "Detalle de alojamiento", path: "/alojamientos", render: DetallePage, load: loadDetallePage },
  comodidades: { title: "Comodidades", path: "/comodidades", render: ComodidadesPage, load: loadComodidadesPage },
  "estado-api": { title: "Estado de API", path: "/estado-api", render: EstadoApiPage, load: loadEstadoApiPage },
  "not-found": { title: "Página no encontrada", path: "", render: NotFoundPage },
};

export function router() {
  const app = document.querySelector("#app");
  if (!app) return;
  const path = window.location.pathname;
  const route = matchRoute(path);
  const page = pageDefinitions[route.name];

  document.title = `${page.title} | Refugio`;
  app.innerHTML = `
    <div class="app-shell">
      ${Navbar(page.path)}
      <main id="main-content" tabindex="-1">${page.render()}</main>
      ${Footer()}
    </div>
  `;

  if (page.load) page.load(...route.params);
  window.bootstrap?.Collapse.getOrCreateInstance(document.querySelector("#mainNavigation"))?.hide();
}

export function navigate(path) {
  if (!path || path === window.location.pathname) return;
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
