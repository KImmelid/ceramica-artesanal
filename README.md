# Cerámica Artesanal

## Requisitos
- Node.js 18+
- Variables en `.env`:
  - `DATABASE_URL`
  - `AUTH_SECRET`

## Ejecutar
```
npm install
npx prisma migrate deploy
npm run dev
```

## Scripts útiles
- `npm run analyze:bundle` → resumen de tamaños en `.next`
- `npm run seed:demo` → semillas de usuarios/productos/órdenes

## Acceso demo
- Admin: `alice@example.com` (role ADMIN)
- User: `bob@example.com` (role USER)

## Documentación
- API: `docs/API.md`
- Manual Técnico / Usuario: `docs/Manual_Tecnico.md`, `docs/Manual_Usuario.md`
- Release notes y pruebas: `docs/ReleaseNotes.md`, `docs/Testing_Report.md`
