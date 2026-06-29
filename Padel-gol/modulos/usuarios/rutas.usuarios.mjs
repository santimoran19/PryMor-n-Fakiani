// Rutas para registro, login y logout de usuarios.

import express from 'express'
import * as controlador from './controlador.usuarios.mjs'

const rutasUsuarios = express.Router()

// POST /registrar → crea un usuario nuevo en la base de datos
rutasUsuarios.post('/registrar', controlador.registrar)

// POST /login → valida credenciales y entrega la cookie con el JWT
rutasUsuarios.post('/login', controlador.login)

// POST /logout → borra la cookie de sesión
rutasUsuarios.post('/logout', controlador.logout)

export default rutasUsuarios
