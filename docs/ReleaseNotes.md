# Release Notes

## v1.0.0
- Admin: listados de Productos, Clientes y Ventas con filtros y paginación.
- Subida de archivos a `public/uploads` con límite y saneamiento de nombre.
- Componentes compartidos: Tabla, Filtros, Paginación, KPIs, Loader, ErrorBoundary.
- Rutas API con `q`, `sort`, `page`, `perPage` y (ventas) `dateFrom/dateTo`.
- Mejoras de UX: toasts globales, textos en español consistentes y estados de carga/errores.

## Cambios técnicos
- Tipados de Prisma en `orderBy` y `where` para evitar errores de TS.
- Helpers `lib/qs.ts` y `lib/paginate.ts` consolidados.

