// Middleware que verifica si hay una sesión válida antes de dejar pasar
// la petición. Lee el JWT desde la cookie firmada "token" y lo valida con
// la misma clave secreta con la que se firmó en el login.
//
// Se usa de dos formas en este proyecto:
//   1) Sobre /admin (archivos estáticos) → si no hay token válido, redirige
//      a /login.html (la redirección es dentro de la propia interfaz).
//   2) Sobre las rutas de la API que modifican datos (POST/PUT/DELETE de
//      canchas) → si no hay token válido, responde 401 en JSON, porque ahí
//      quien pregunta es código JavaScript (fetch), no el navegador
//      navegando directamente.

import jwt from 'jsonwebtoken'

function comprobarToken(req, res, next) {
    const token = req.signedCookies['token']

    if (!token) {
        return responderSinSesion(req, res)
    }

    jwt.verify(token, process.env.FIRMA_JWT, (error, datosUtiles) => {
        if (error) {
            console.log('Token inválido o vencido:', error.message)
            return responderSinSesion(req, res)
        }

        req.usuario = datosUtiles // queda disponible para el resto de la petición
        next()
    })
}

function responderSinSesion(req, res) {
    // Si la petición es a la API (la hace el JS del front con fetch), respondemos
    // con un mensaje claro en JSON para que la interfaz lo muestre sin recargar
    // la página. Si es la carga directa de /admin.html en el navegador,
    // redirigimos dentro de la propia interfaz (a /login.html).
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(401).json({ error: 'Tenés que iniciar sesión para hacer esto' })
    }
    res.redirect('/login.html')
}

export default comprobarToken
