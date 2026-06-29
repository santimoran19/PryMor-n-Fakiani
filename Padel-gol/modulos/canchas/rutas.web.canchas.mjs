// Rutas de la API de solo lectura para la web pública.
// Expone 2 endpoints que el front-end público (canchas.html) consume para
// mostrar las canchas. Se reutilizan las mismas funciones del controlador
// que usa la API de administración, así no duplicamos lógica.
// Esta API no requiere sesión: es de solo lectura y pública.

import express from 'express'
import * as controlador from './controlador.canchas.mjs'

const rutasWebCanchas = express.Router()

// Endpoint 1: Listado de canchas para la web
// GET /api/web/canchas
rutasWebCanchas.get('/api/web/canchas', controlador.obtenerCanchas)

// Endpoint 2: Detalle de una cancha para la web
// GET /api/web/canchas/:id
rutasWebCanchas.get('/api/web/canchas/:id', controlador.obtenerCanchaPorId)

export default rutasWebCanchas
