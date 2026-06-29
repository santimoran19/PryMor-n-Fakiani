// Modelo de la entidad Usuario para PostgreSQL.
// Contiene las consultas SQL que interactúan con la tabla "usuarios".

import pool from '../../conexion.bd.mjs'

// ─────────────────────────────────────────────────────────────────────────────
// Buscar un usuario por su nombre de usuario
// Retorna undefined si no existe ninguno con ese nombre
// ─────────────────────────────────────────────────────────────────────────────
export async function encontrarPorUsuario(usuario) {
    try {
        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE usuario = $1',
            [usuario]
        )
        return resultado.rows[0]
    } catch (error) {
        console.error('Error en el modelo (encontrarPorUsuario):', error.message)
        throw error
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Crear un nuevo usuario
// El passwordHash ya viene hasheado desde el controlador (con bcrypt)
// ─────────────────────────────────────────────────────────────────────────────
export async function crear({ usuario, passwordHash }) {
    try {
        const resultado = await pool.query(
            `INSERT INTO usuarios (usuario, password_hash)
             VALUES ($1, $2)
             RETURNING id, usuario, created_at`,
            [usuario, passwordHash]
        )
        return resultado.rows[0]
    } catch (error) {
        console.error('Error en el modelo (crear usuario):', error.message)
        throw error
    }
}
