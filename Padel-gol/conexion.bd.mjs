// Conexión a la base de datos PostgreSQL.
// Usamos el paquete "pg" con un Pool de conexiones, igual que en clase.
//
// El SSL se decide automáticamente según el host de la conexión:
//   - Si es una base local (localhost / 127.0.0.1, por ejemplo la que se
//     levanta con docker-compose para probar en la propia PC) NO se pide SSL,
//     porque un Postgres local no lo tiene habilitado.
//   - Si es una base en la nube (Supabase, Render, etc.) SÍ se pide SSL,
//     porque esos proveedores lo exigen para aceptar conexiones externas.
// Así el mismo código funciona sin tocar nada, ya sea que el profesor
// corrija con la base local de Docker o con Supabase.

import { Pool } from 'pg'

function esBaseLocal(connectionString) {
    try {
        const { hostname } = new URL(connectionString)
        return hostname === 'localhost' || hostname === '127.0.0.1'
    } catch {
        return false
    }
}

const usarSSL = !esBaseLocal(process.env.DATABASE_URL)

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: usarSSL ? { rejectUnauthorized: false } : false
})

export default pool
