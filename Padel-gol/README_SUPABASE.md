# Guía rápida: configurar la base de datos y ejecutar la app

El proyecto se conecta a PostgreSQL a través de `conexion.bd.mjs`, que detecta
automáticamente si la conexión es local (Docker) o en la nube (Supabase) según
el host de `DATABASE_URL`, y activa SSL solo en el segundo caso.

## Opción A — Usar Supabase (cloud)

1. Crear cuenta en https://app.supabase.com y crear un nuevo proyecto.
2. En el panel del proyecto, ir a **Settings → Database → Connection string** y
   copiar la URI. Elegir **Session pooler** (puerto 5432), no la conexión
   directa, para evitar problemas de IPv6 en redes que no la soportan.
3. Crear un archivo `.env` en la raíz del proyecto (copiando `.env.example`) y
   completar:

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

## Datos de ejemplo (siembra automática)

`npm run db:init` no solo crea las tablas: si la tabla `canchas` está vacía,
carga automáticamente 9 canchas de ejemplo (4 de Pádel, 3 de Fútbol 5 y 2 de
Fútbol 7) para que la aplicación no arranque sin nada para mostrar. Esto pasa
sin importar si la base es la de Supabase de este proyecto o una nueva que
arme otra persona (por ejemplo, para corregir el trabajo) — apenas corre
`npm run db:init` por primera vez, ya tiene canchas reales para probar
reservas, sin tener que cargarlas a mano desde el panel de administración.

Si la tabla ya tiene canchas cargadas (de una corrida anterior, o porque se
agregaron a mano), `npm run db:init` no inserta nada de nuevo: no duplica
datos por más veces que se corra.

Las canchas de ejemplo también están listadas como `INSERT` en
`scripts/estructura.sql`, por si en algún momento hace falta cargarlas a mano
directamente por SQL (por ejemplo, desde la extensión Database Client de
VSCode o desde el editor SQL de Supabase).

## Notas

- Las tablas que crea/verifica `npm run db:init` (y `scripts/estructura.sql`,
  que es la misma estructura en SQL puro): `canchas`, `usuarios` y `reservas`.
- Usuarios y reservas no se siembran con datos de ejemplo: un usuario se crea
  registrándose desde `/registro.html`, y las reservas se crean reservando una
  cancha desde `/reservas.html` (no requiere haber iniciado sesión).
- Para producción, configurar `DATABASE_URL`, `PUERTO`, `FIRMA_COOKIE` y
  `FIRMA_JWT` como variables de entorno en el servicio de hosting (Render,
  Railway, etc.), en vez de usar un archivo `.env`.
