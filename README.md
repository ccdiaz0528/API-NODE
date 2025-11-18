# Mi API Backend

API REST para gestión de usuarios construida con Express.js y MySQL.

## Características

- ✅ Manejo de errores robusto con respuestas JSON
- ✅ Validación de datos en entrada
- ✅ Conexión persistente a MySQL
- ✅ CORS habilitado
- ✅ Códigos HTTP apropiados en respuestas

## Requisitos Previos

- Node.js (versión 14 o superior)
- MySQL Server en ejecución
- npm o yarn

## Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd mi-api-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar la base de datos**

Asegúrate de que MySQL esté corriendo y actualiza las credenciales en `server.js`:

```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Cambia si usas otro usuario
    password: '',        // Añade tu contraseña
    database: 'miapi'
});
```

4. **Crear la base de datos y tabla** (si no existen)

```sql
CREATE DATABASE miapi;

USE miapi;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Uso

### Iniciar el servidor

```bash
node server.js
```

El servidor estará disponible en `http://localhost:3000`

### Endpoints

#### GET - Obtener todos los usuarios

```bash
curl http://localhost:3000/usuarios
```

**Respuesta exitosa (200):**
```json
[
  { "id": 1, "nombre": "Juan", "email": "juan@example.com", "created_at": "2025-11-18T10:30:00.000Z" },
  { "id": 2, "nombre": "María", "email": "maria@example.com", "created_at": "2025-11-18T10:35:00.000Z" }
]
```

**Respuesta con error (500):**
```json
{ "error": "Conexión a la base de datos no disponible" }
```

---

#### POST - Crear un nuevo usuario

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"juan@example.com"}'
```

**Parámetros requeridos:**
- `nombre` (string): Nombre del usuario
- `email` (string): Email del usuario

**Respuesta exitosa (201):**
```json
{ "id": 3, "nombre": "Juan", "email": "juan@example.com" }
```

**Respuesta con validación fallida (400):**
```json
{ "error": "Faltan campos requeridos: nombre y email" }
```

**Respuesta con error BD (500):**
```json
{ "error": "Duplicate entry 'juan@example.com' for key 'email'" }
```

---

#### PUT - Actualizar un usuario

```bash
curl -X PUT http://localhost:3000/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan Updated","email":"juan.new@example.com"}'
```

**Parámetros:**
- `id` (URL): ID del usuario a actualizar
- `nombre` (string): Nuevo nombre
- `email` (string): Nuevo email

**Respuesta exitosa (200):**
```json
{ "message": "Usuario actualizado correctamente" }
```

**Respuesta con usuario no encontrado (404):**
```json
{ "error": "Usuario no encontrado" }
```

---

#### DELETE - Eliminar un usuario

```bash
curl -X DELETE http://localhost:3000/usuarios/1
```

**Parámetros:**
- `id` (URL): ID del usuario a eliminar

**Respuesta exitosa (200):**
```json
{ "message": "Usuario eliminado correctamente" }
```

**Respuesta con usuario no encontrado (404):**
```json
{ "error": "Usuario no encontrado" }
```

---

## Manejo de Errores

Todos los errores son devueltos como respuestas JSON con códigos HTTP apropiados:

| Código | Significado |
|--------|------------|
| 200 | Solicitud exitosa |
| 201 | Recurso creado correctamente |
| 400 | Solicitud inválida (faltan campos requeridos) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor (BD, conexión, etc.) |

### Ejemplos de errores

**Base de datos no disponible:**
```json
{ "error": "Conexión a la base de datos no disponible" }
```

**Validación fallida:**
```json
{ "error": "Faltan campos requeridos: nombre y email" }
```

**Error en la operación:**
```json
{ "error": "Error al obtener usuarios" }
```

## Estructura del Proyecto

```
mi-api-backend/
├── server.js          # Archivo principal del servidor
├── package.json       # Dependencias del proyecto
├── package-lock.json  # Versiones exactas de dependencias
└── README.md          # Este archivo
```

## Dependencias

- **express**: Framework web para Node.js
- **mysql**: Driver para conexión a MySQL
- **cors**: Middleware para habilitar CORS

Ver `package.json` para más detalles.

## Testing

Puedes usar herramientas como Postman, Insomnia o curl para probar los endpoints.

### Ejemplo con PowerShell

```powershell
# GET - Obtener usuarios
Invoke-WebRequest -Uri "http://localhost:3000/usuarios"

# POST - Crear usuario
$body = @{ nombre = "Juan"; email = "juan@example.com" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/usuarios" -Method Post -Body $body -ContentType "application/json"

# PUT - Actualizar usuario
$body = @{ nombre = "Juan Updated"; email = "juan.new@example.com" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/usuarios/1" -Method Put -Body $body -ContentType "application/json"

# DELETE - Eliminar usuario
Invoke-WebRequest -Uri "http://localhost:3000/usuarios/1" -Method Delete
```

## Mejoras Futuras

- [ ] Autenticación y autorización (JWT)
- [ ] Rate limiting
- [ ] Paginación en listados
- [ ] Búsqueda y filtros avanzados
- [ ] Logs persistentes
- [ ] Tests automatizados
- [ ] Migración a mysql2/promise o similar para async/await
- [ ] Documentación Swagger/OpenAPI

## Licencia

MIT

## Autor

Creado con ❤️ para aprender Node.js y APIs REST
