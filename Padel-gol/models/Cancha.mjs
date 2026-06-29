// Modelo de la entidad Cancha para PostgreSQL.
// Contiene todas las consultas SQL que interactúan con la tabla "canchas".
// El controlador llama a estas funciones sin saber cómo están implementadas,
// lo que respeta la separación de responsabilidades del patrón MVC.
//
// Cada función maneja sus propios errores con try/catch: los registra en
// consola con el contexto de la operación y los relanza para que el
// controlador decida qué responder al cliente (sin perder el código de
// error de PostgreSQL, como 22P02 o 23514).

import { pool } from '../config/db.mjs'

// ─────────────────────────────────────────────────────────────────────────────
// Obtener todas las canchas (ordenadas por fecha de creación, más nuevas primero)
// ─────────────────────────────────────────────────────────────────────────────
const encontrarTodas = async () => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM canchas ORDER BY created_at DESC'
        )
        return resultado.rows
    } catch (error) {
        console.error('Error en el modelo (encontrarTodas):', error.message)
        throw error
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Obtener una cancha por su ID
// Retorna undefined si no existe ninguna con ese ID
// ─────────────────────────────────────────────────────────────────────────────
const encontrarPorId = async (id) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM canchas WHERE id = $1',
            [id]
        )
        return resultado.rows[0]
    } catch (error) {
        console.error('Error en el modelo (encontrarPorId):', error.message)
        throw error
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Crear una nueva cancha
// RETURNING * hace que PostgreSQL devuelva el registro recién insertado
// ─────────────────────────────────────────────────────────────────────────────
const crear = async ({ nombre, deporte, precio, capacidad, disponible }) => {
    try {
        const resultado = await pool.query(
            `INSERT INTO canchas (nombre, deporte, precio, capacidad, disponible)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [nombre, deporte, precio, capacidad, disponible]
        )
        return resultado.rows[0]
    } catch (error) {
        console.error('Error en el modelo (crear):', error.message)
        throw error
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Actualizar una cancha existente
// Retorna undefined si no se encontró ninguna cancha con ese ID
// ─────────────────────────────────────────────────────────────────────────────
const actualizar = async (id, { nombre, deporte, precio, capacidad, disponible }) => {
    try {
        const resultado = await pool.query(
            `UPDATE canchas
             SET nombre = $1, deporte = $2, precio = $3, capacidad = $4,
                 disponible = $5, updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [nombre, deporte, precio, capacidad, disponible, id]
        )
        return resultado.rows[0]
    } catch (error) {
        console.error('Error en el modelo (actualizar):', error.message)
        throw error
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Eliminar una cancha
// Retorna el registro eliminado (o undefined si no existía)
// ─────────────────────────────────────────────────────────────────────────────
const eliminar = async (id) => {
    try {
        const resultado = await pool.query(
            'DELETE FROM canchas WHERE id = $1 RETURNING *',
            [id]
        )
        return resultado.rows[0]
    } catch (error) {
        console.error('Error en el modelo (eliminar):', error.message)
        throw error
    }
}

export { encontrarTodas, encontrarPorId, crear, actualizar, eliminar }
