# API

Listado de endpoints con filtros y paginación.

Parámetros comunes de consulta (query):
- `q`: texto de búsqueda.
- `sort`: orden en formato `campo:dir` donde `dir` es `asc` o `desc`.
- `page`: página (>= 1). Por defecto 1.
- `perPage`: ítems por página. Por defecto 20. Máx 100.
- `dateFrom`, `dateTo`: (solo ventas) límites de fecha en formato `YYYY-MM-DD`.

Respuesta común:
```json
{
  "data": [ /* items */ ],
  "meta": { "page": 1, "perPage": 20, "total": 123, "totalPages": 7, "hasNext": true, "hasPrev": false }
}
```

## GET /api/ventas

Lista ventas con filtros.

- Requiere rol ADMIN.
- `q` busca en `status`, `user.name` y `user.email`.
- `sort` permite: `createdAt`, `total`, `id`, `status`.
- `dateFrom` y `dateTo` filtran por `createdAt`.

## GET /api/productos

Lista productos con filtros.

- `q` busca por `name` (insensible a mayúsculas).
- `sort` permite: `createdAt`, `price`, `name`, `stock`, `id`.

## GET /api/clientes

Lista clientes con filtros.

- Requiere rol ADMIN.
- `q` busca en `name` y `email`.
- `sort` permite: `createdAt`, `name`, `email`, `id`.

