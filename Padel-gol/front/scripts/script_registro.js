const formulario = document.getElementById('form-registro')
const campoUsuario = document.getElementById('campo-usuario')
const campoPass = document.getElementById('campo-pass')
const mensajeRegistro = document.getElementById('mensaje-registro')

function mostrarMensaje(texto, tipo) {
    mensajeRegistro.textContent = texto
    mensajeRegistro.className = `mensaje-form mensaje-${tipo}`
    mensajeRegistro.style.display = 'block'
}

formulario.addEventListener('submit', async (e) => {
    e.preventDefault()

    const datos = {
        usuario: campoUsuario.value.trim(),
        pass: campoPass.value
    }

    try {
        const respuesta = await fetch('/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })

        const resultado = await respuesta.json()

        if (!respuesta.ok) {
            mostrarMensaje(resultado.error || 'No se pudo registrar el usuario', 'error')
            return
        }

        mostrarMensaje('Usuario creado correctamente, ya podés iniciar sesión.', 'exito')
        formulario.reset()

        // Redirección dentro de la propia interfaz, con un pequeño delay para
        // que se llegue a leer el mensaje de éxito antes de cambiar de página
        setTimeout(() => {
            window.location.href = 'login.html'
        }, 1800)

    } catch (error) {
        console.error('Error al registrar:', error)
        mostrarMensaje('Error de conexión con el servidor', 'error')
    }
})
