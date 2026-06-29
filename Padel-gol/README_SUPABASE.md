# Guía rápida: configurar la base de datos y ejecutar la app

El proyecto se conecta a PostgreSQL a través de `conexion.bd.mjs`, que detecta
automáticamente si la conexión es local (Docker) o en la nube (Supabase) según
el host de `DATABASE_URL`, y activa SSL solo en el segundo caso.

## Opción A — Usar Supabase (cloud)

1. Crear cuenta en https://app.supabase.com y crear un nuevo proyecto.
2. En el panel del proyecto, ir a **Settings → Database → Connection string** y copiar la URI.
3. Crear un archivo `.env` en la raíz del proyecto (copiando `.env.example`) y completar:

   ```
   DATABASE_URL="postgresql://usuario:password@host:5432/dbname"
   PUERTO=3000
   FIRMA_COOKIE="una-clave-cualquiera"
   FIRMA_JWT="otra-clave-cualquiera"
   ```

4. Instalar dependencias y crear las tablas:

   ```bash
   npm install
   npm run db:init
   npm run dev
   ```

## Opción B — Postgres local con Docker (para desarrollo)

1. Tener Docker instalado.
2. Levantar la base con el `docker-compose.yml` incluido:

   ```bash
   docker-compose up -d
   ```

3. La base queda disponible en `postgresql://padel:padelpass@localhost:5432/padeldb`.
4. Crear `.env` con esa `DATABASE_URL` (ver `.env.example`) y ejecutar:

   ```bash
   npm install
   npm run db:init
   npm run dev
   ```

5. Se puede abrir Adminer en http://localhost:8080 para inspeccionar la base
   (user: `padel`, pass: `padelpass`, db: `padeldb`).

## Notas

- `npm run db:init` corre `scripts/setup-db.mjs`, que crea las tablas
  `canchas`, `usuarios` y `reservas` si no existen (no borra datos).
- Para producción, configurar `DATABASE_URL`, `PUERTO`, `FIRMA_COOKIE` y
  `FIRMA_JWT` como variables de entorno en el servicio de hosting (Render,
  Railway, etc.).
