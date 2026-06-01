// TP3 - Aplicaciones Web 2 - Padel & Gol
// Punto de entrada principal del servidor.
// En esta etapa refactorizamos el proyecto para seguir el patrón MVC:
//   - Modelos   → /models   (estructura de datos en la DB)
//   - Vistas    → /front    (archivos HTML/CSS/JS del cliente)
//   - Controladores → /controllers (lógica de cada operación)
// Las rutas actúan como intermediarias entre las peticiones y los controladores.

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import conectarDB from './config/db.mjs'
import rutasApiCanchas from './routes/apiCanchas.mjs'
import rutasWebCanchas from './routes/webCanchas.mjs'

// Cargar las variables de entorno desde el archivo .env
// Debe llamarse antes de usar process.env
dotenv.config()

const PUERTO = process.env.PORT || 3000
const app = express()

// Conectar con la base de datos antes de recibir peticiones
conectarDB()

// ── Middleware ────────────────────────────────────────────────────────────────

// Permite que Express lea el body de las peticiones en formato JSON
app.use(express.json())

// Habilitar CORS para que el front pueda consumir la API desde otro origen
app.use(cors())

// Servir los archivos estáticos del front-end (HTML, CSS, JS del cliente)
app.use(express.static('front'))

// ── Registro de Rutas ─────────────────────────────────────────────────────────

// API CRUD para el panel de administración (5 endpoints: 2 lecturas, alta, baja, modificación)
// Prefijo: /api/canchas
app.use('/api/canchas', rutasApiCanchas)

// API de solo lectura para la web pública (2 endpoints de lectura)
// Prefijo: /api/web
app.use('/api/web', rutasWebCanchas)

// ── Iniciar servidor ──────────────────────────────────────────────────────────
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})
