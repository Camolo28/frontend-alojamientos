# Frontend Alojamientos — Sprint 2

SPA de Refugio con JavaScript Vanilla, Vite, Bootstrap 5.3 y Bootstrap Icons. Incluye registro, login JWT, perfil de lectura, administración de usuarios de lectura y cierre de sesión mediante sessionStorage.

## Ejecución

Requiere Node.js 22.12+ y la API Flask con MySQL activa.

```bash
npm install
cp .env.example .env
npm run dev
npm test
npm run build
npm run preview
```

Configura `VITE_API_URL=http://localhost:5000` en `.env`. Reinicia Vite después de cambiarlo. Para probar en desarrollo, abre http://localhost:5173. Preview usa http://localhost:4173. El backend debe permitir ambos orígenes en CORS para probar ambos modos, además de Content-Type y Authorization.

## Funcionalidades

- Páginas públicas de Inicio, Alojamientos, Detalle, Comodidades, Estado de API y 404.
- History API, navegación sin recarga, Atrás y Adelante, filtro por título o ciudad.
- `/registro` valida correo, contraseña de 6 a 128 caracteres y confirmación.
- `/login` obtiene `access_token`, consulta el perfil con Bearer y guarda token y usuario en `sessionStorage` bajo `alojamientos.sesion`.
- `/perfil` requiere sesión y consulta información actual del backend.
- `/admin/usuarios` requiere rol `admin` y muestra nombre, correo y rol.
- `/no-autorizado` informa cuando el rol no permite entrar.
- Navbar por sesión y rol. Cerrar sesión elimina los datos y vuelve a Inicio.
- Un 401 correspondiente al token vigente elimina la sesión, actualiza la Navbar y redirige al login con un aviso. Las respuestas antiguas no eliminan una sesión nueva.
- Errores 400, 401, 403 y 409, datos vacíos, carga y fallos de conexión.

## Contrato de la API

| Método | Ruta | Datos o respuesta |
| --- | --- | --- |
| POST | /api/v1/usuarios/registro | nombre opcional, correo, contrasena; devuelve usuario |
| POST | /api/v1/usuarios/login | correo, contrasena; devuelve access_token |
| GET | /api/v1/usuarios/perfil | Bearer; devuelve id, correo, rol, perfil.nombre |
| GET | /api/v1/admin/usuarios | Bearer de administrador; devuelve usuarios como arreglo |
| GET | /health | Estado del servicio |
| GET | /api/v1/alojamientos | Catálogo público |
| GET | /api/v1/alojamientos/:id | Detalle público |
| GET | /api/v1/comodidades | Comodidades públicas |

Flask debe validar el token y el rol en sus endpoints. El control de navegación del frontend complementa esa autorización.

En el backend del estudiante verificado durante el trabajo existen health y autenticación. Las tres rutas públicas del catálogo están pendientes en ese backend y sus vistas presentan error hasta que estén disponibles. Esto limita la comprobación de datos reales del Sprint 1.

## Estructura

- `src/js/api/http.js`: cliente Fetch centralizado; `client.js` conserva sus exportaciones para los consumidores del Sprint 1.
- `src/js/api/auth.api.js`: servicios de autenticación.
- `src/js/state/sesion.js`: almacenamiento y recuperación de sesión.
- `src/js/router/permisos.js`: decisión de acceso utilizada por el router y sus pruebas.
- `src/js/pages/`: páginas públicas y de autenticación.
- `src/js/components/`: componentes reutilizables.
- `src/js/utils/validaciones.js`: validaciones de formularios.
- `src/css/main.css`: estilos responsive.
- `tests/`: 9 pruebas anteriores y 14 nuevas con node:test.

## Validación y evidencias

`npm test` ejecuta 23 pruebas. Las 14 nuevas cubren sesión, Navbar, validaciones, permisos, contratos de registro/login/perfil/listado, manejo de errores y 401. Utilizan Fetch y sessionStorage simulados. Fueron creadas para los requisitos del enunciado; el archivo del Tutorial 2 no fue facilitado para comparar sus casos exactos.

Ejecuta con Flask y MySQL activos y captura:

1. Registro exitoso y rechazo de correo duplicado (409).
2. Login incorrecto (401) y login correcto seguido del perfil (200).
3. Perfil tras recargar la pestaña y redirección al login desde una ventana sin sesión.
4. Acceso restringido para un usuario común y listado para admin.
5. Cierre de sesión con Navbar de visitante y bloqueo del perfil.
6. Token inválido en sessionStorage, respuesta 401 y regreso al login con aviso.
7. Backend rechazando una consulta administrativa con token de usuario (403). Se puede repetir la solicitud desde las herramientas de desarrollo sustituyendo el token con el de la cuenta de usuario. Mantén los tokens fuera de las capturas.
8. Vista móvil de formularios, perfil y tabla; Atrás, Adelante y 404.
9. Terminal con 23 pruebas aprobadas y build correcto.

Los flujos reales de registro, login, perfil, admin y cierre fueron verificados por el estudiante antes de estos ajustes. Las pruebas automatizadas y compilación de esta versión se verificaron por separado. Se requiere repetir localmente el flujo de token inválido y las verificaciones finales con la API real.

## Publicación conservando el PR del Sprint 1

La rama `feat/sprint-02-autenticacion` se creó desde `feat/sprint-01-spa-publica` porque el PR #1 debe permanecer abierto para revisión. Copia el contenido actualizado sobre tu carpeta del frontend, conservando `.git` y tu `.env` local.

```bash
git switch feat/sprint-02-autenticacion
npm install
npm test
npm run build
git add src tests README.md
git commit -m "feat: frontend registro login jwt y autorizacion"
git push -u origin feat/sprint-02-autenticacion
```

Crea el PR del Sprint 2 comparando `feat/sprint-02-autenticacion` contra `feat/sprint-01-spa-publica` para mostrar únicamente los cambios del segundo trabajo. En la descripción referencia la Issue #2 y explica la dependencia del PR #1. Cuando el profesor autorice integrar el Sprint 1, actualiza main y cambia la base del PR del Sprint 2 a main. La actualización de main queda pendiente de esa revisión.

Título sugerido: Sprint 2 del frontend — Autenticación, sesión y autorización.

Descripción sugerida: Incorpora registro, login JWT, perfil, listado administrativo de lectura, Navbar por rol y cierre de sesión. Los 401 eliminan la sesión vigente y actualizan la interfaz. Validación automatizada: 23 pruebas aprobadas y compilación Vite correcta. Relacionado con #2. Depende del PR #1, abierto para revisión. El catálogo real depende de las rutas públicas pendientes del backend.

## ZIP

El ZIP contiene fuentes, pruebas, README, configuración y lockfile. Excluye node_modules, dist, .env y .git. Para regenerarlo después del commit:

```bash
git archive --format=zip --prefix=frontend-alojamientos/ --output=../frontend-alojamientos-sprint-2.zip HEAD
```
