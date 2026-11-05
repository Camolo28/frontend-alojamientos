# Publicación y entrega final

## Estado del historial revisado

Se clonó el repositorio remoto y se verificaron las ramas de los tres sprints. La cadena de commits incluye `a61f092` (Sprint 1), `67f9935` (Sprint 2) y `40b3ee0` (Sprint 3). En el momento de preparación, main apuntaba a `baff66f`, el README inicial. Los PR utilizados son #1, #3 y #5.

La tarea final pide integrar las ramas. Esto cambia el estado de revisión de los PR previos y sustituye la instrucción temporal de dejarlos abiertos. Si el profesor exige mantenerlos abiertos todavía, debe resolver esa condición antes de presentar main como definitivo.

## Copiar y publicar la versión preparada

En la carpeta local del frontend:

```bash
git switch feat/sprint-03-crud-comodidades
git status --short
git switch -c docs/entrega-final
```

Guarda primero cualquier cambio local pendiente. Extrae `frontend-alojamientos-final.zip` y copia el contenido de su carpeta frontend-alojamientos sobre tu proyecto, conservando `.git` y `.env`. Ejecuta:

```bash
npm install
npm test
npm run build
git add .gitignore README.md src tests docs package.json package-lock.json
git commit -m "docs: finalizar documentacion y entrega frontend"
git push -u origin docs/entrega-final
```

## Integrar main conservando el historial

Si tienes permisos de escritura y la rama principal permite merges directos:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git merge --no-ff origin/feat/sprint-01-spa-publica -m "merge: integrar sprint 1"
git merge --no-ff origin/feat/sprint-02-autenticacion -m "merge: integrar sprint 2"
git merge --no-ff origin/feat/sprint-03-crud-comodidades -m "merge: integrar sprint 3"
git merge --no-ff origin/docs/entrega-final -m "merge: integrar entrega final"
npm test
npm run build
git push origin main
```

Si un merge presenta conflicto, detente para revisarlo; evita forzar el push. Si main está protegida, integra mediante Pull Requests en ese orden, ajustando sus ramas base a main y usando merge commits para conservar el historial. Al terminar comprueba en GitHub que main contiene src, tests, docs y el README final. Los PR con base en ramas intermedias pueden requerir ajustar su base o cerrarse indicando el merge que integró su contenido.

## Prueba de clon independiente exigida

Después de publicar main, usa una carpeta nueva. No copies node_modules ni .env de tu instalación anterior:

```bash
cd ~/Downloads
git clone https://github.com/Camolo28/frontend-alojamientos.git frontend-alojamientos-verificacion
cd frontend-alojamientos-verificacion
npm install
cp .env.example .env
npm test
npm run dev
```

Con el backend y MySQL activos prueba catálogo, registro/login, CRUD y comodidades. Detén Vite con Ctrl+C y ejecuta:

```bash
npm run build
npm run preview
```

Guarda evidencia de esta ejecución si el docente solicita demostrar el clon. La comprobación de instalación limpia realizada durante la preparación fue sobre el artefacto final local; el clon remoto de main final requiere publicar primero los cambios.

## Generar el ZIP exacto de main

Desde tu proyecto original ya integrado y publicado:

```bash
git switch main
git status --short
git fetch origin
git rev-parse HEAD
git rev-parse origin/main
git archive --format=zip --prefix=frontend-alojamientos/ --output="$HOME/Downloads/frontend-alojamientos-entrega-final.zip" HEAD
```

`git status` debe estar vacío y los dos hashes deben coincidir. El ZIP generado así corresponde al commit publicado. `.gitignore` excluye node_modules, dist, .env, cachés y archivos temporales. Git archive incluye los archivos versionados, por lo que conviene comprobar también `git ls-files node_modules dist .env`, que debe quedar vacío.

## Entrega al docente

- ZIP frontend generado desde main.
- Repositorio https://github.com/Camolo28/frontend-alojamientos, visible para el docente.
- README y docs incluidos en el mismo commit.
- Evidencias reales de docs/evidencias y resultados de test/build.
- Historial de los sprints conservado, con PR #1, #3 y #5 identificables.
- Backend actualizado disponible para ejecutar la integración.

## Comprobaciones pendientes del titular

Autenticar GitHub, publicar el backend completado y el frontend final, integrar main, repetir la instalación desde el clon remoto y confirmar que el profesor pueda acceder al repositorio. Estas operaciones no se pudieron ejecutar desde el entorno de preparación por falta de credenciales de escritura de GitHub.
