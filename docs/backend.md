# Backend Flask y MySQL

## Por qué hay un complemento de backend

El repositorio `Camolo28/api-alojamientos` tenía autenticación y migración 001. Para comprobar los requisitos pendientes se completó una copia con el dominio alojamientos, las migraciones 002/003 y los ocho endpoints del catálogo/CRUD. Se entrega en `api-alojamientos-completado.zip`, separado del ZIP frontend. El esquema propuesto sigue el enunciado; el Tutorial 3 original no se proporcionó para comparar detalles adicionales.

## Actualizar la copia local existente

En Git Bash, crea una rama antes de copiar los archivos:

```bash
cd ~/Desktop/Polisura/api-alojamientos
git switch -c feat/completar-alojamientos-comodidades
```

Extrae el ZIP del backend y copia su contenido dentro de esa carpeta, conservando `.git`, `.venv` y `.env`. Si Git señala cambios propios pendientes, guárdalos antes de cambiar de rama. Conserva una copia de la base de datos existente antes de aplicar migraciones.

Activa MySQL en XAMPP. En la terminal del backend:

```bash
source .venv/Scripts/activate
python -m pip install -r requirements.txt
```

El `.env` local debe definir DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME y SECRET_KEY. Usa tus credenciales existentes, una clave secreta aleatoria y:

```dotenv
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

Conserva el DB_NAME que ya funciona en tu equipo (por ejemplo, midb o alojamientos_db). En una instalación nueva puedes crear una base con `CREATE DATABASE alojamientos_db CHARACTER SET utf8mb4;` y usar ese nombre en .env.

```bash
python -m flask --app app db upgrade
python -m flask --app app db current
python -m flask --app app routes
python -m pytest -q
python app.py
```

`db current` debe mostrar 003. `db upgrade` aplica solo las revisiones pendientes. El script no elimina tablas existentes ni datos de usuarios. La migración 002 crea alojamientos y la 003 crea comodidades y su tabla intermedia. Los downgrade son operaciones de reversión que eliminan esas tablas y no forman parte de la instalación.

## Primera cuenta administradora

Registra una cuenta desde la interfaz y, en una terminal libre del backend con el entorno virtual activo, ejecuta:

```bash
python scripts/promover_admin.py tu-correo-de-prueba@example.com
```

Vuelve a iniciar sesión para recuperar el rol actualizado. Este comando es una herramienta local del backend existente. El frontend no modifica roles.

## Compatibilidad de las verificaciones

La integración de esta entrega se ejecutó en MySQL 8.0.36 sobre Linux con Flask y navegador Chromium. El puerto 3307 se usó solo para aislar la base de verificación; tu XAMPP conserva 3306. XAMPP suele incluir MariaDB: ejecuta las migraciones y las comprobaciones también en tu instalación. Las cuentas y datos de las capturas son sintéticos y no se incluyen como credenciales o base de datos en los ZIP.

## Errores frecuentes

| Síntoma | Comprobación |
| --- | --- |
| Conexión rechazada en 5000 | Flask debe permanecer ejecutándose |
| Conexión rechazada en 3306 | Inicia MySQL y revisa DB_HOST/DB_PORT |
| Unknown database | Crea la base y revisa DB_NAME |
| Tabla inexistente | Ejecuta db upgrade y confirma revisión 003 |
| Registro parece fallo de red y Flask registra 500 | Revisa el error de Flask y la configuración de MySQL |
| CORS bloquea solicitudes | Comprueba origen exacto, puerto y reinicia Flask después de editar .env |
| 401 | Repite login; revisa SECRET_KEY y expiración |
| 403 | Verifica propietario o rol administrador |
| 409 al crear comodidad | Usa un nombre diferente |

## Publicación del backend

```bash
git add app migrations tests .env.example .gitignore README.md
git commit -m "feat: completar API alojamientos y comodidades"
git push -u origin feat/completar-alojamientos-comodidades
```

Publica e integra esa rama según las reglas de revisión del backend. El frontend final debe ejecutarse contra esa versión actualizada.
