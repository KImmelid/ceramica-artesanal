# Testing Report

## Alcance
- Endpoints principales (GET productos, GET clientes, GET ventas, POST productos, POST pedidos, POST upload)
- Páginas de admin (render y estados de carga)

## Pruebas manuales
- Búsqueda con `q`: coincidencias por nombre/email/id según entidad
- Orden `sort`: fecha, precio, stock, nombre; ventas por total
- Paginación: navegación siguiente/anterior, límites y totales
- Rango de fechas en ventas: `dateFrom` y/o `dateTo`
- Subida de archivo: retorno de URL pública y existencia en `public/uploads`

## Resultados
- Respuestas en formato `{ rows, meta }` (ventas/clientes/productos) correctas
- Errores controlados con códigos 4xx/5xx y mensajes en español

## Quick API Test (cURL)

Productos (GET list):
```
curl "http://localhost:3000/api/productos?q=taza&sort=price_desc&page=1&perPage=20"
```

Clientes (GET list, requiere ADMIN):
```
# Autenticarse o usar cookies de sesión
curl -H "Cookie: <cookies>" "http://localhost:3000/api/clientes?q=alice&page=1&perPage=20"
```

Ventas (GET con rango de fechas):
```
curl "http://localhost:3000/api/ventas?dateFrom=2025-01-01&dateTo=2025-12-31&sort=total_desc&page=1"
```

Upload (POST multipart):
```
curl -F "file=@./mi-imagen.png" http://localhost:3000/api/upload
```

## Pendientes / Sugerencias
- Añadir pruebas automatizadas de API (Jest/ViTest) y e2e (Playwright)
- Mock de Prisma para tests unitarios

