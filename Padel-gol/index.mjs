// TP4 - Aplicaciones Web 2 - Padel & Gol
// Punto de entrada principal del servidor.
//
// Estructura (patrón MVC, un módulo por entidad):
//   modulos/canchas/   → modelo, controlador, rutas y vista de las canchas
//   modulos/usuarios/  → modelo, controlador y rutas de registro/login/logout
//   middlewares/       → comprobarToken (protege el panel de admin y el CRUD)
//   conexion.bd.mjs    → conexión a PostgreSQL (Supabase)
//   iniciar.env.mjs    → carga las variables de entorno desde .env
//
// Sobre CORS: no lo habilitamos porque el front-end y la API se sirven desde
// el mismo dominio y puerto (todo corre adentro de este mismo servidor
// Express), así que el navegador nunca hace una petición cross-origin.
// Si en el futuro el front se separara a otro dominio, ahí sí haría falta.

import './iniciar.env.mjs'
import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import rutasCanchas from './modulos/canchas/rutas.canchas.mjs'
import rutasWebCanchas from './modulos/canchas/rutas.web.canchas.mjs'
import rutasUsuarios from './modulos/usuarios/rutas.usuarios.mjs'
import rutasReservas from './modulos/reservas/rutas.reservas.mjs'
import rutasWebReservas from './modulos/reservas/rutas.web.reservas.mjs'
import comprobarToken from './middlewares/comprobarToken.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PUERTO = process.env.PUERTO || process.env.PORT || 3000
const app = express()

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.FIRMA_COOKIE)) // habilita req.signedCookies

// ── Panel de administración protegido ────────────────────────────────────────
// admin.html solo se entrega si hay una sesión válida (cookie con JWT).
// Si no la hay, comprobarToken redirige a /login.html.
app.get('/admin.html', comprobarToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'admin.html'))
})

// Servir el resto de los archivos estáticos del front-end (HTML, CSS, JS del cliente)
app.use(express.static('front'))

// ── Registro de Rutas ─────────────────────────────────────────────────────────

// Login / registro / logout
app.use(rutasUsuarios)

// API CRUD para el panel de administración (5 endpoints: 2 lecturas, alta, baja, modificación)
// Las operaciones de escritura están protegidas con comprobarToken
app.use(rutasCanchas)

// API de solo lectura para la web pública (2 endpoints de lectura)
app.use(rutasWebCanchas)

// API CRUD de reservas para el panel de administración (mismo criterio que canchas)
app.use(rutasReservas)

// API de solo lectura de reservas para la web pública (la consume reservas.html)
app.use(rutasWebReservas)

// ── Iniciar servidor ──────────────────────────────────────────────────────────
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})
