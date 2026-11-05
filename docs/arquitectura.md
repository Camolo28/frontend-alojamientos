# Arquitectura y decisiones

## Recorrido de una petición

La página renderiza su HTML; su función load conecta eventos y consulta servicios. Los servicios de api invocan request en http.js. Este cliente construye la URL desde VITE_API_URL, incorpora JSON y Bearer cuando corresponde, valida el estado y devuelve el JSON o null en un 204. Flask aplica las validaciones, permisos y transacciones; MySQL almacena los datos.

## Navegación

`routes.js` reconoce rutas con expresiones regulares. `router.js` aplica destinoProtegido, cambia la URL cuando corresponde y renderiza Navbar, vista y Footer. `main.js` escucha enlaces data-link y popstate. Crear una vista nueva sustituye el contenido de #app, por lo que las respuestas asíncronas de gestión comprueban que su contenedor siga conectado antes de navegar.

## Sesión

`sesion.js` guarda token y usuario en sessionStorage. La sesión se recupera después de recargar la pestaña. Las funciones de permisos comparan el rol y normalizan identificadores a cadenas para comparar propiedad. La firma, expiración del JWT y el rol vigente se comprueban en Flask para cada operación privada.

## Consistencia de operaciones

Publicar realiza una sola petición POST y bloquea su botón. La edición del alojamiento y su selección de comodidades tienen formularios separados; cada operación confirma su propio resultado. Mientras se guardan o eliminan datos se bloquean los botones del área. La eliminación pide confirmación previa. La API ejecuta asociaciones en una transacción, valida que todos los identificadores existan y bloquea la fila del alojamiento durante las mutaciones en MySQL.

## Presentación y validación

Los datos externos se escapan al construir HTML o se asignan con textContent. Las tarjetas usan enlaces SPA. Los formularios combinan restricciones HTML y validaciones JavaScript con las reglas de Flask. Los estados usan role=status o aria-live. Bootstrap proporciona los controles responsive y el menú colapsable.

## Límites del proyecto

El alcance incluye los endpoints de los tres tutoriales. Reservas, pagos, subida de imágenes, edición del perfil, renovación de JWT y edición/eliminación de comodidades del catálogo quedan fuera del alcance solicitado. Las imágenes del alojamiento son opcionales de lectura en las tarjetas públicas; los formularios de gestión capturan los cuatro campos requeridos.
