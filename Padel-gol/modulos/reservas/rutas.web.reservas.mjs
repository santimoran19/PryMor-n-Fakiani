// Rutas de la API de solo lectura para la web pública.
// Expone los 2 endpoints que reservas.html / script_reservas.js consumen.
// No requiere sesión: es de solo lectura y pública, igual que rutas.web.canchas.mjs.

import express from 'express'
import * as controlador from './controlador.reservas.mjs'

const rutasWebReservas = express.Router()

// Endpoint 1: Listado de reservas para la web
// GET /api/web/reservas
rutasWebReservas.get('/api/web/reservas', controlador.obtenerReservas)

// Endpoint 2: Detalle de una reserva para la web
// GET /api/web/reservas/:id
rutasWebReservas.get('/api/web/reservas/:id', controlador.obtenerReservaPorId)

// Endpoint 3: Crear una reserva desde la web pública (sin necesidad de login,
// es la idea central de un sistema de gestión de reservas: que cualquier
// visitante pueda reservar una cancha). La validación de conflicto de
// horario está en el controlador, así que dos personas no pueden reservar
// la misma cancha a la misma fecha/hora.
// POST /api/web/reservas
rutasWebReservas.post('/api/web/reservas', controlador.crearReserva)

export default rutasWebReservas
