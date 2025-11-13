# Manual Técnico

## Arquitectura
- Framework: Next.js (App Router)
- Base de datos: Prisma Client (`lib/db.ts`)
- Autenticación: `@/auth` (NextAuth)
- UI: TailwindCSS + componentes en `app/admin/componentes` y `app/componentes`

## Estructura
- `app/` páginas y rutas (incluye `app/api/*`)
- `lib/` utilidades (db, parseo, paginación)
- `docs/` documentación del proyecto
- `public/` estáticos (incl. `uploads/`)
- `scripts/` utilidades (siembra, análisis)

## Endpoints
- Ver `docs/API.md` para parámetros (`q`, `sort`, `page`, `perPage`, fechas) y respuesta `{ rows, meta }`.

## Base de datos
- Prisma inicializado como singleton en `lib/db.ts`.
- Entidades usadas: `product`, `user`, `order`.

## Estándares
- Tipar `where`/`orderBy` con tipos de Prisma para evitar errores TS.
- Páginas admin en Server Components con Prisma directo para eficiencia.
- Estados `loading.tsx`/`error.tsx` por segmento admin.

## Build/Run
- `npm run dev` / `npm run build` / `npm start`
- Variables: `.env` con `DATABASE_URL`, `AUTH_SECRET`.

## Scripts
- `npm run analyze:bundle` → resumen de `.next`.
- `npm run seed:demo` → siembra datos de ejemplo.

## Notas técnicas
- `/api/upload` crea `public/uploads` si falta, límite 5MB y saneamiento de nombre.
- Guard de admin en `app/admin/layout.tsx` con `redirect` si no es ADMIN.

