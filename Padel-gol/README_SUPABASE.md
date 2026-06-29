Guía rápida: configurar Supabase (o Postgres local) y ejecutar la app

Opción A — Usar Supabase (cloud):
1. Crear cuenta en https://app.supabase.com y crear un nuevo proyecto.
2. En el panel del proyecto, ir a Settings → Database → Connection Pooling / Connection string.
3. Copiar la `Connection string` (URI) y abrir la sección de `Settings → Database → API` si necesitas detalles.
4. En tu máquina, dentro de la carpeta `Padel-gol`, crear un archivo `.env` copiando `.env.example` y pegando la `DATABASE_URL`:

   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   PUERTO=3000

5. Ejecutar:

```powershell
cd E:\Escritorio\pryfakianimoran\Padel-gol
npm install
npm run dev
```

6. La app ejecutará `conectarDB()` que creará la tabla `canchas` si no existe.

Opción B — Ejecutar Postgres local con Docker (útil para desarrollo):
1. Asegúrate de tener Docker instalado.
2. En `Padel-gol` ya hay un `docker-compose.yml` con Postgres y Adminer. Ejecuta:

```bash
cd E:/Escritorio/pryfakianimoran/Padel-gol
docker-compose up -d
```

3. La base de datos estará en `postgresql://padel:padelpass@localhost:5432/padeldb`.
4. Crear `.env` con esa `DATABASE_URL` y arrancar la app:

```powershell
# copiar .env.example a .env y editar la URL
npm install
npm run dev
```

5. Puedes abrir Adminer en http://localhost:8080 para inspeccionar la DB (user: `padel`, pass: `padelpass`, db: `padeldb`).

Notas:
- Asegúrate de que las conexiones remotas permitan SSL si usas Supabase; `db.mjs` ya configura `ssl: { rejectUnauthorized: false }`.
- Para producción en la nube, configura la variable `DATABASE_URL` en el panel del servicio (Render, Railway, Heroku, etc.).
