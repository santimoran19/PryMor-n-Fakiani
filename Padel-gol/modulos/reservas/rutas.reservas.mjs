// Rutas de la API CRUD para administrar reservas.
// Mismo criterio que canchas: las lecturas son abiertas, las que modifican
// datos (alta, baja, modificación) están protegidas con comprobarToken.
// Se monta sin prefijo extra en index.mjs (las rutas ya incluyen /api/reservas).

import express from 'express'
import * as controlador from './controlador.reservas.mjs'
import comprobarToken from '../../middlewares/comprobarToken.mjs'

const rutasReservas = express.Router()

// ── LECTURA 1 ─────────────────────────────────────────────────────────────────
// GET /api/reservas → retorna el listado completo de reservas (lo usa el panel)
rutasReservas.get('/api/reservas', controlador.obtenerReservas)

// ── LECTURA 2 ─────────────────────────────────────────────────────────────────
// GET /api/reservas/:id → retorna los datos de una reserva específica
rutasReservas.get('/api/reservas/:id', controlador.obtenerReservaPorId)

// ── ALTA ──────────────────────────────────────────────────────────────────────
// POST /api/reservas → crea una nueva reserva (requiere sesión iniciada)
rutasReservas.post('/api/reservas', comprobarToken, controlador.crearReserva)

// ── MODIFICACIÓN ──────────────────────────────────────────────────────────────
// PUT /api/reservas/:id → actualiza una reserva existente (requiere sesión iniciada)
rutasReservas.put('/api/reservas/:id', comprobarToken, controlador.actualizarReserva)

// ── BAJA ──────────────────────────────────────────────────────────────────────
// DELETE /api/reservas/:id → elimina una reserva (requiere sesión iniciada)
rutasReservas.delete('/api/reservas/:id', comprobarToken, controlador.eliminarReserva)

export default rutasReservas
