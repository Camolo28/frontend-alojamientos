import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/main.css";
import * as bootstrap from "bootstrap";
import { handleDocumentClick, router } from "./router/router.js";

window.bootstrap = bootstrap;
document.addEventListener("click", handleDocumentClick);
window.addEventListener("popstate", router);
window.addEventListener("sesion-expirada", () => {
  window.history.replaceState({}, "", "/login");
  router();
  const mensaje = document.querySelector("#login-mensaje");
  if (mensaje) {
    mensaje.className = "mt-3 mb-0 text-danger";
    mensaje.textContent = "Tu sesión expiró o dejó de ser válida. Vuelve a iniciar sesión.";
  }
});
router();
