const formulario = document.getElementById('form-login')
const campoUsuario = document.getElementById('campo-usuario')
const campoPass = document.getElementById('campo-pass')
const mensajeLogin = document.getElementById('mensaje-login')

function mostrarMensaje(texto, tipo) {
    mensajeLogin.textContent = texto
    mensajeLogin.className = `mensaje-form mensaje-${tipo}`
    mensajeLogin.style.display = 'block'
}

formulario.addEventListener('submit', async (e) => {
    e.preventDefault()

    const datos = {
        usuario: campoUsuario.value.trim(),
        pass: campoPass.value
    }

    try {
        const respuesta = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })

        const resultado = await respuesta.json()

        if (!respuesta.ok) {
            mostrarMensaje(resultado.error || 'No se pudo iniciar sesión', 'error')
            return
        }

        mostrarMensaje('Sesión iniciada, entrando al panel...', 'exito')

        // Redirección dentro de la propia interfaz
        window.location.href = 'admin.html'

    } catch (error) {
        console.error('Error al iniciar sesión:', error)
        mostrarMensaje('Error de conexión con el servidor', 'error')
    }
})
