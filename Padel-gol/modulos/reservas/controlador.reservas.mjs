// Controlador de reservas.
// Contiene la lógica de negocio para cada operación del CRUD de reservas.
// Llama al modelo para acceder a la base de datos y devuelve la respuesta HTTP.

import * as modelo from './modelo.reservas.mjs'

// ─────────────────────────────────────────────────────────────────────────────
// LECTURA 1: Obtener todas las reservas
// GET /api/reservas
// ─────────────────────────────────────────────────────────────────────────────
export async function obtenerReservas(req, res) {
    try {
        const reservas = await modelo.encontrarTodas()
        res.json(reservas)
    } catch (error) {
        console.error('Error en obtenerReservas:', error.message)
        res.status(500).json({ error: 'Error interno al obtener las reservas' })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// LECTURA 2: Obtener una reserva por su ID
// GET /api/reservas/:id
// ─────────────────────────────────────────────────────────────────────────────
export async function obtenerReservaPorId(req, res) {
    try {
        const reserva = await modelo.encontrarPorId(req.params.id)

        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada' })
        }

        res.json(reserva)
    } catch (error) {
        console.error('Error en obtenerReservaPorId:', error.message)

        // El código 22P02 indica que se pasó un valor no numérico como ID
        if (error.code === '22P02') {
            return res.status(400).json({ error: 'El ID proporcionado no es válido' })
        }

        res.status(500).json({ error: 'Error interno al obtener la reserva' })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// ALTA: Crear una nueva reserva
// POST /api/reservas
// ─────────────────────────────────────────────────────────────────────────────
export async function crearReserva(req, res) {
    try {
        const { cancha_id, usuario, fecha, hora, estado } = req.body
        if (!cancha_id || !usuario || !fecha || !hora) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: cancha_id, usuario, fecha, hora' })
        }

        const nuevaReserva = await modelo.crear({ cancha_id, usuario, fecha, hora, estado })

        // 201 Created: el recurso fue creado exitosamente
        res.status(201).json(nuevaReserva)
    } catch (error) {
        console.error('Error en crearReserva:', error.message)

        // El código 23503 indica que cancha_id no existe (FOREIGN KEY)
        if (error.code === '23503') {
            return res.status(400).json({ error: 'La cancha indicada no existe' })
        }

        res.status(400).json({ error: 'Error al crear la reserva', detalle: error.message })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MODIFICACIÓN: Actualizar una reserva existente (por ejemplo, su estado)
// PUT /api/reservas/:id
// ─────────────────────────────────────────────────────────────────────────────
export async function actualizarReserva(req, res) {
    try {
        const reservaActualizada = await modelo.actualizar(req.params.id, req.body)

        if (!reservaActualizada) {
            return res.status(404).json({ error: 'Reserva no encontrada' })
        }

        res.json(reservaActualizada)
    } catch (error) {
        console.error('Error en actualizarReserva:', error.message)

        if (error.code === '22P02') {
            return res.status(400).json({ error: 'El ID proporcionado no es válido' })
        }
        if (error.code === '23503') {
            return res.status(400).json({ error: 'La cancha indicada no existe' })
        }

        res.status(400).json({ error: 'Error al actualizar', detalle: error.message })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// BAJA: Eliminar una reserva
// DELETE /api/reservas/:id
// ─────────────────────────────────────────────────────────────────────────────
export async function eliminarReserva(req, res) {
    try {
        const reservaEliminada = await modelo.eliminar(req.params.id)

        if (!reservaEliminada) {
            return res.status(404).json({ error: 'Reserva no encontrada' })
        }

        res.json({ mensaje: 'Reserva eliminada correctamente' })
    } catch (error) {
        console.error('Error en eliminarReserva:', error.message)

        if (error.code === '22P02') {
            return res.status(400).json({ error: 'El ID proporcionado no es válido' })
        }

        res.status(500).json({ error: 'Error interno al eliminar la reserva' })
    }
}
