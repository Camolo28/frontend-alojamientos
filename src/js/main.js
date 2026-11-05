import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/main.css";
import * as bootstrap from "bootstrap";
import { handleDocumentClick, router } from "./router/router.js";

window.bootstrap = bootstrap;
document.addEventListener("click", handleDocumentClick);
window.addEventListener("popstate", router);
router();
