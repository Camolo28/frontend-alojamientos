# Frontend Alojamientos

SPA pública para consultar alojamientos y comodidades desde la API REST del proyecto. Está construida con JavaScript Vanilla, módulos ES6, Vite y Bootstrap 5.3.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm
- API Flask de Alojamientos disponible en `http://localhost:5000`

## Instalación y ejecución

```bash
npm install
cp .env.example .env
npm run dev
```

Vite queda disponible en `http://localhost:5173`. La API debe permitir solicitudes CORS desde ese origen. Para usar otra URL, cambia `VITE_API_URL` en `.env`.

## Comandos

```bash
npm test
npm run build
npm run preview
```

## Funcionalidades del Sprint 1

- Navegación SPA con History API, `pushState` y `popstate`.
- Inicio, catálogo, detalle, comodidades, estado de API y página 404.
- Consultas públicas `GET /health`, `GET /api/v1/alojamientos`, `GET /api/v1/alojamientos/:id` y `GET /api/v1/comodidades`.
- Filtro del catálogo por título o ciudad.
- Estados de carga, error, catálogo vacío y búsqueda sin resultados.
- Diseño adaptable con Bootstrap y estilos propios.

El proyecto no incluye autenticación, sesiones, roles ni operaciones de escritura sobre la API.

## Compatibilidad con el backend anterior

Este frontend se prepara como repositorio independiente del backend [`Camolo28/api-alojamientos`](https://github.com/Camolo28/api-alojamientos). En la versión revisada del backend ya existen `GET /health` y CORS para `http://localhost:5173`; todavía no están registrados `GET /api/v1/alojamientos`, `GET /api/v1/alojamientos/:id` ni `GET /api/v1/comodidades`. Las pantallas y llamadas para esos recursos están listas, pero mostrarán el estado de error hasta que esos endpoints estén disponibles en el backend.

## Estructura

```text
src/
  css/main.css
  js/
    api/           Cliente HTTP y endpoints públicos
    components/    Navbar, footer, feedback y tarjeta
    pages/         Vistas públicas
    router/        Rutas y navegación SPA
    utils/         Formato, filtros y seguridad de texto
    main.js        Punto de entrada
tests/             Pruebas con node:test
```

Las respuestas de colección pueden ser arreglos directos o contener el arreglo en `data`, `result`, `results`, `items`, `alojamientos` o `comodidades`. Los campos visibles aceptan nombres habituales como `titulo`/`nombre`, `ciudad`/`municipio`, `descripcion` e `imagen_url`. Cuando confirmemos el esquema real del backend, se puede dejar ese mapeo con los nombres exactos.

## Entrega

Para preparar el ZIP sin dependencias instaladas ni archivos de compilación:

```bash
zip -r frontend-alojamientos.zip . -x 'node_modules/*' 'dist/*' '.env' '.git/*' '.codex/*' 'frontend-alojamientos.zip'
```

El repositorio esperado es `frontend-alojamientos`. Publica la rama del Sprint 1 y abre un Pull Request con un resumen de las vistas, endpoints y verificaciones realizadas.
