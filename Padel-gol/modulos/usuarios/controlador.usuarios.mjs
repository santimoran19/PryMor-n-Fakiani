// Controlador de usuarios.
// Maneja el registro, el inicio de sesión y el cierre de sesión.
// La autenticación funciona así: se hashea la contraseña con bcrypt antes
// de guardarla, y al iniciar sesión se firma un JWT que se manda al cliente
// adentro de una cookie firmada (signed), httpOnly y con duración limitada.

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as modelo from './modelo.usuarios.mjs'

// ─────────────────────────────────────────────────────────────────────────────
// Registrar un nuevo usuario
// POST /registrar
// ─────────────────────────────────────────────────────────────────────────────
export async function registrar(req, res) {
    try {
        const { usuario, pass } = req.body

        if (!usuario || !pass) {
            return res.status(400).json({ error: 'Faltan el usuario o la contraseña' })
        }

        if (pass.length < 4) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' })
        }

        // Hasheamos la contraseña antes de guardarla, nunca se guarda en texto plano
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(pass, salt)

        const nuevoUsuario = await modelo.crear({ usuario, passwordHash })

        res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario: nuevoUsuario.usuario })

    } catch (error) {
        console.error('Error en registrar:', error.message)

        // El código 23505 indica que el usuario ya existe (UNIQUE)
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ese nombre de usuario ya está en uso' })
        }

        res.status(500).json({ error: 'Error interno al registrar el usuario' })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Iniciar sesión
// POST /login
// ─────────────────────────────────────────────────────────────────────────────
export async function login(req, res) {
    try {
        const { usuario, pass } = req.body

        if (!usuario || !pass) {
            return res.status(400).json({ error: 'Faltan el usuario o la contraseña' })
        }

        const usuarioEncontrado = await modelo.encontrarPorUsuario(usuario)

        if (!usuarioEncontrado) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
        }

        // Comparamos la contraseña ingresada contra el hash guardado en la BD
        const passwordCorrecta = bcrypt.compareSync(pass, usuarioEncontrado.password_hash)

        if (!passwordCorrecta) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
        }

        // Datos útiles que va a guardar el token (el payload)
        const datosUtiles = {
            usuario: usuarioEncontrado.usuario
        }

        jwt.sign(datosUtiles, process.env.FIRMA_JWT, { expiresIn: '1h' }, (error, token) => {
            if (error) {
                console.error('Error al firmar el token:', error.message)
                return res.status(500).json({ error: 'Error interno al iniciar sesión' })
            }

            res.cookie('token', token, {
                signed: true,
                httpOnly: true,
                sameSite: 'lax',
                secure: true,
                maxAge: 1000 * 60 * 60 // 1 hora
            })

            res.json({ mensaje: 'Sesión iniciada correctamente' })
        })

    } catch (error) {
        console.error('Error en login:', error.message)
        res.status(500).json({ error: 'Error interno al iniciar sesión' })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Cerrar sesión
// POST /logout
// ─────────────────────────────────────────────────────────────────────────────
export async function logout(req, res) {
    res.clearCookie('token')
    res.json({ mensaje: 'Sesión cerrada correctamente' })
}
