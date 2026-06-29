// Script para crear (o recrear) la estructura de la base de datos.
// Se ejecuta con: npm run db:init
// Usa CREATE TABLE IF NOT EXISTS, así se puede correr varias veces sin
// romper nada ni borrar datos que ya existan.

import '../iniciar.env.mjs'
import pool from '../conexion.bd.mjs'

async function crearTablas() {
    try {
        await pool.query('SELECT 1')
        console.log('Conexión a la base de datos (Supabase) exitosa')

        await pool.query(`
            CREATE TABLE IF NOT EXISTS canchas (
                id         SERIAL PRIMARY KEY,
                nombre     VARCHAR(100)   NOT NULL,
                deporte    VARCHAR(50)    NOT NULL,
                precio     NUMERIC(10,2)  NOT NULL CHECK (precio >= 0),
                capacidad  INTEGER        NOT NULL CHECK (capacidad >= 1),
                disponible BOOLEAN        NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP      DEFAULT NOW(),
                updated_at TIMESTAMP      DEFAULT NOW()
            )
        `)
        console.log('Tabla "canchas" verificada')

        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id            SERIAL PRIMARY KEY,
                usuario       VARCHAR(50)  NOT NULL UNIQUE,
                password_hash VARCHAR(200) NOT NULL,
                created_at    TIMESTAMP    DEFAULT NOW()
            )
        `)
        console.log('Tabla "usuarios" verificada')

        console.log('Base de datos lista.')
        process.exit(0)

    } catch (error) {
        console.error('Error al crear la base de datos:', error.message)
        process.exit(1)
    }
}

crearTablas()
