// Rutas de la API CRUD para administrar canchas.
// Esta API tiene 5 endpoints (2 lecturas, alta, baja y modificación).
// Se monta bajo el prefijo /api/canchas en index.mjs.
// Es utilizada por el panel de administración, por lo que las rutas que
// modifican datos (POST, PUT, DELETE) están protegidas con comprobarToken.

import express from 'express'
import * as controlador from './controlador.canchas.mjs'
import comprobarToken from '../../middlewares/comprobarToken.mjs'

const rutasCanchas = express.Router()

// ── LECTURA 1 ─────────────────────────────────────────────────────────────────
// GET /api/canchas → retorna el listado completo de canchas (pública, la usa el panel)
rutasCanchas.get('/api/canchas', controlador.obtenerCanchas)

// ── LECTURA 2 ─────────────────────────────────────────────────────────────────
// GET /api/canchas/:id → retorna los datos de una cancha específica
rutasCanchas.get('/api/canchas/:id', controlador.obtenerCanchaPorId)

// ── ALTA ──────────────────────────────────────────────────────────────────────
// POST /api/canchas → crea una nueva cancha (requiere sesión iniciada)
rutasCanchas.post('/api/canchas', comprobarToken, controlador.crearCancha)

// ── MODIFICACIÓN ──────────────────────────────────────────────────────────────
// PUT /api/canchas/:id → actualiza una cancha existente (requiere sesión iniciada)
rutasCanchas.put('/api/canchas/:id', comprobarToken, controlador.actualizarCancha)

// ── BAJA ──────────────────────────────────────────────────────────────────────
// DELETE /api/canchas/:id → elimina una cancha (requiere sesión iniciada)
rutasCanchas.delete('/api/canchas/:id', comprobarToken, controlador.eliminarCancha)

export default rutasCanchas
