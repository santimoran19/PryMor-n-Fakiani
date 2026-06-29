// Modelo de la entidad Reserva para PostgreSQL.
// Contiene todas las consultas SQL que interactúan con la tabla "reservas".
// Las lecturas hacen JOIN con "canchas" para devolver el nombre de la cancha
// directamente (así el front no tiene que pedir la cancha por separado).

import pool from '../../conexion.bd.mjs'

// ─────────────────────────────────────────────────────────────────────────────
// Obtener todas las reservas (ordenadas por fecha y hora, más nuevas primero)
// ─────────────────────────────────────────────────────────────────────────────
export async function encontrarTodas() {
    try {
        const resultado = await pool.query(`
            SELECT r.id, r.cancha_id, c.nombre AS cancha, r.usuario,
                   r.fecha::text AS fecha, r.hora, r.estado, r.created_at
            FROM reservas r
            JOIN canchas c ON c.id = r.cancha_id
            ORDER BY r.fecha DESC, r.hora DESC
        `)
        return resultado.rows
    } catch (error) {
        console.error('Error en el modelo (encontrarTodas reservas):', error.message)
        throw error
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Obtener una reserva por su ID
// Retorna undefined si no existe ninguna con ese ID
// ─────────────────────────────────────────────────────────────────────────────
export async function encontrarPorId(id) {
    try {
        const resultado = await pool.query(`
            SELECT r.id, r.cancha_id, c.nombre AS cancha, r.usuario,
                   r.fecha::text AS fecha, r.hora, r.estado, r.created_at
            FROM reservas r
            JOIN canchas c ON c.id = r.cancha_id
            WHERE r.id = $1
        `, [id])
        return resultado.rows[0]
    } catch (error) {
        console.error('Error en el modelo (encontrarPorId reservas):', error.message)
        throw error
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Buscar si ya existe una reserva activa (no cancelada) para la misma
// cancha, fecha y hora. Se usa para evitar reservas duplicadas/superpuestas.
// ─────────────────────────────────────────────────────────────────────────────
export async function encontrarConflicto({ cancha_id, fecha, hora }) {
    try {
        const resultado = await pool.query(
            `SELECT id FROM reservas
             WHERE cancha_id = $1 AND fecha = $2 AND hora = $3
               AND estado != 'cancelada'`,
            [cancha_id, fecha, hora]
        )
        return resultado.rows[0]
    } catch (error) {
        console.error('Error en el modelo (encontrarConflicto reservas):', error.message)
        throw error
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Crear una nueva reserva
// El estado por defecto es "pendiente" si no se especifica otro
// ─────────────────────────────────────────────────────────────────────────────
export async function crear({ cancha_id, usuario, fecha, hora, estado }) {
    try {
        const resultado = await pool.query(
            `INSERT INTO reservas (cancha_id, usuario, fecha, hora, estado)
             VALUES ($1, $2, $3, $4, COALESCE($5, 'pendiente'))
             RETURNING id`,
            [cancha_id, usuario, fecha, hora, estado]
        )
        // Devolvemos la reserva recién creada ya con el nombre de la cancha (JOIN)
        return await encontrarPorId(resultado.rows[0].id)
    } catch (error) {
        console.error('Error en el modelo (crear reserva):', error.message)
        throw error
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Actualizar una reserva existente (por ejemplo, cambiar su estado)
// Retorna undefined si no se encontró ninguna reserva con ese ID
// ─────────────────────────────────────────────────────────────────────────────
export async function actualizar(id, { cancha_id, usuario, fecha, hora, estado }) {
    try {
        const resultado = await pool.query(
            `UPDATE reservas
             SET cancha_id = $1, usuario = $2, fecha = $3, hora = $4, estado = $5
             WHERE id = $6
             RETURNING id`,
            [cancha_id, usuario, fecha, hora, estado, id]
        )
        if (!resultado.rows[0]) return undefined
        return await encontrarPorId(id)
    } catch (error) {
        console.error('Error en el modelo (actualizar reserva):', error.message)
        throw error
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Eliminar una reserva
// Retorna el registro eliminado (o undefined si no existía)
// ─────────────────────────────────────────────────────────────────────────────
export async function eliminar(id) {
    try {
        const resultado = await pool.query(
            'DELETE FROM reservas WHERE id = $1 RETURNING *',
            [id]
        )
        return resultado.rows[0]
    } catch (error) {
        console.error('Error en el modelo (eliminar reserva):', error.message)
        throw error
    }
}
