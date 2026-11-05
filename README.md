# Frontend Alojamientos — Sprint 3

SPA de Refugio construida con JavaScript Vanilla, Vite, Bootstrap 5.3 y Bootstrap Icons. Conserva el catálogo público, la autenticación JWT y los permisos del Sprint 2 e incorpora CRUD de alojamientos y gestión de asociaciones con comodidades.

## Instalación

Node.js 22.12+ y npm. Desde la carpeta que contiene package.json:

```bash
npm install
cp .env.example .env
npm test
npm run dev
npm run build
npm run preview
```

`.env` debe contener `VITE_API_URL=http://localhost:5000`. Reinicia Vite al cambiarlo. Desarrollo usa localhost:5173 y preview localhost:4173. Flask debe permitir en CORS el origen utilizado, Authorization, Content-Type y los métodos GET, POST, PATCH, DELETE y OPTIONS.

## Alcance

- Catálogo, detalles, comodidades, estado de API, filtros, History API, 404 y diseño responsive.
- Registro, login, perfil de lectura, usuarios administrativos de lectura, sessionStorage y cierre de sesión.
- `/mis-alojamientos` filtra el listado público por `usuario_id`, incluso si los identificadores vienen como cadenas.
- `/alojamientos/nuevo` permite publicar a usuarios autenticados.
- `/alojamientos/:id/editar` permite gestionar al propietario o a un administrador, después de consultar el recurso.
- Guardar datos y guardar comodidades son operaciones independientes, cada una con confirmación y error propios. La selección envía el arreglo completo `comodidades_ids`, incluido `[]` para retirar todas las relaciones.
- Eliminar solicita confirmación y procesa 204 No Content antes de regresar a Mis alojamientos.
- `/admin/comodidades/nueva` permite crear comodidades al administrador, con aviso específico de duplicado 409.
- Login conserva la ruta protegida solicitada en `next`, valida que sea una ruta local conocida y aplica otra vez los permisos al navegar.
- Un 401 del token vigente elimina la sesión y actualiza la interfaz. Un 403 conserva la sesión.
- La API determina definitivamente autorización, propiedad y persistencia.

## Contrato utilizado

| Método | Ruta | Cuerpo |
| --- | --- | --- |
| GET | /api/v1/alojamientos | Sin cuerpo |
| GET | /api/v1/alojamientos/:id | Sin cuerpo |
| POST | /api/v1/alojamientos | titulo, descripcion, ciudad, precio_por_noche |
| PATCH | /api/v1/alojamientos/:id | titulo, descripcion, ciudad, precio_por_noche |
| DELETE | /api/v1/alojamientos/:id | Sin cuerpo; éxito 204 |
| GET | /api/v1/comodidades | Sin cuerpo |
| POST | /api/v1/comodidades | nombre |
| PATCH | /api/v1/alojamientos/:id/comodidades | comodidades_ids como arreglo numérico completo |

Las mutaciones envían `Authorization: Bearer <token>`. El usuario propietario se obtiene de `usuario_id`; las comodidades asociadas se leen como objetos `{id, nombre}` en `comodidades`. El precio usa `precio_por_noche` numérico. El usuario autenticado conserva el contrato del backend de Sprint 2 (id, correo, rol y perfil.nombre).

Estos campos se basan en el enunciado y el frontend anterior. Los DTO, esquemas de respuestas y límites exactos del backend de Sprint 3 no fueron proporcionados. Los textos se validan como obligatorios, el precio como positivo y finito, y el nombre de comodidad como no vacío. Flask valida las restricciones adicionales de su contrato.

## Archivos principales

- `api/alojamientos.api.js` y `api/comodidades.api.js`: mutaciones Fetch.
- `api/alojamientos.js`: consultas públicas conservadas.
- `api/http.js`: JSON, Bearer, errores y 204; `client.js` reexporta para el Sprint 1.
- `utils/gestion.js`: normalización, propiedad, filtro de publicaciones y retorno seguro.
- `utils/validaciones.js`: formularios de los Sprints 2 y 3.
- `components/AlojamientoForm.js` y `components/ComodidadesSelector.js`: formularios reutilizables.
- `pages/CrearAlojamientoPage.js`, `MisAlojamientosPage.js`, `EditarAlojamientoPage.js`, `AdminCrearComodidadPage.js`.
- `router/permisos.js`: control de navegación utilizado por las vistas y pruebas.

Las rutas de creación y edición se reconocen antes de la ruta genérica del detalle.

## Pruebas y estado de verificación

Se ejecutaron las 23 pruebas anteriores antes de modificar el proyecto. `npm test` ejecuta ahora 37 pruebas (23 anteriores y 14 nuevas), todas aprobadas. `npm run build` compila correctamente. Las nuevas pruebas cubren POST/PATCH/DELETE, 204, selección completa/vacía, normalización, validaciones, propiedad, rutas, retorno local y componentes. Fetch se simula en las pruebas de servicios.

También se verificaron eventos de formularios en un DOM simulado con API simulada: retorno del login, creación, listado propio, edición, asignación y retirada de comodidades, cancelación y confirmación de eliminación y acceso de administrador. Esta comprobación no incluye renderizado visual en un navegador real.

Las 14 pruebas nuevas se elaboraron para este enunciado; no se recibió el Tutorial 3 para comparar sus casos exactos. La comprobación con Flask, MySQL y las migraciones 001, 002 y 003 está pendiente. En la última revisión del backend del estudiante solo estaban disponibles autenticación, health y la migración 001. Los mocks no demuestran persistencia ni autorización real del servidor.

## Verificación local y evidencias obligatorias

Primero confirma que tu backend de Sprint 3 contiene las migraciones 002 y 003. Desde su entorno virtual ejecuta `python -m flask --app app db upgrade`, `python -m flask --app app db current` y `python -m flask --app app routes`. Comprueba las rutas del cuadro anterior antes de iniciar `python app.py`.

Con MySQL y Flask activos:

1. Abre una ruta protegida sin sesión, inicia sesión y verifica el retorno a esa ruta.
2. Publica un alojamiento. Guarda captura de Crear alojamiento y del POST 201. Verifica su aparición en Mis alojamientos y en el catálogo después de recargar.
3. Modifica título, descripción, ciudad y precio; comprueba PATCH 200, detalle actualizado y persistencia tras F5.
4. Selecciona comodidades y guarda; comprueba el detalle. Desmarca todas, guarda y verifica que el arreglo vacío retiró las asociaciones.
5. Cancela primero la confirmación de eliminación y confirma que el registro permanece. Después acepta y comprueba DELETE 204 y ausencia del registro tras recargar.
6. Usa una segunda cuenta y visita la edición del alojamiento ajeno; debe mostrar Acceso restringido. Verifica también que la API devuelva 403 al intentar mutarlo con el token de esa segunda cuenta y que la sesión permanezca activa.
7. Con admin, edita un alojamiento ajeno y crea una comodidad. Repite el nombre para probar el 409. Captura Crear comodidad y la restricción con usuario común.
8. Prueba recurso inexistente (404), datos inválidos (400), token inválido (401), estados vacíos y errores de conexión.
9. Revisa las cuatro páginas nuevas a 375 px y en escritorio. Guarda las capturas de 37 pruebas aprobadas y build correcto.

No incluyas contraseñas o JWT en las evidencias.

## Git, Issue y Pull Request

Mientras los PR de los Sprints 1 y 2 permanezcan abiertos por revisión, crea el Sprint 3 desde la rama del Sprint 2. La actualización de main queda pendiente de autorización del profesor para integrar los PR previos.

Antes de copiar los archivos del ZIP, en tu carpeta existente:

```bash
git switch feat/sprint-02-autenticacion
git status --short
git switch -c feat/sprint-03-crud-comodidades
```

Si `git status` muestra cambios propios pendientes, guárdalos antes de continuar. Extrae el ZIP y copia su contenido sobre la carpeta existente, conservando `.git` y `.env`. Crea una Issue titulada "Sprint 3 — CRUD de alojamientos y comodidades". Después:

```bash
npm install
npm test
npm run build
git add src tests README.md package.json package-lock.json
git commit -m "feat: completar frontend CRUD y comodidades"
git push -u origin feat/sprint-03-crud-comodidades
```

Abre el PR con base `feat/sprint-02-autenticacion` y compare `feat/sprint-03-crud-comodidades`, referencia la nueva Issue y explica la dependencia del PR #3. Cuando se integren los trabajos anteriores, actualiza main y cambia la base a main.

Título sugerido: Sprint 3 — CRUD de alojamientos y gestión de comodidades.

Descripción sugerida: Añade publicación, consulta de alojamientos propios, edición y eliminación con confirmación, selección completa de comodidades y creación administrativa de comodidades. Aplica permisos por rol y propiedad y retorno local después del login. Verificación local automatizada: 37 pruebas aprobadas y build correcto. La validación end-to-end con Flask/MySQL y las migraciones 002/003 queda pendiente de ejecutar con el backend de Sprint 3.

## ZIP de entrega

Incluye código, pruebas, configuración, lockfile y README; excluye node_modules, dist, .env y .git. Tras guardar el commit:

```bash
git archive --format=zip --prefix=frontend-alojamientos/ --output=../frontend-alojamientos-sprint-3.zip HEAD
```
