// ── Referencias DOM — formulario de reserva ──────────────────────────────────
const formularioReserva = document.getElementById('form-reserva')
const campoCancha       = document.getElementById('campo-cancha')
const campoNombre       = document.getElementById('campo-nombre-reserva')
const campoFecha        = document.getElementById('campo-fecha')
const campoHora         = document.getElementById('campo-hora')
const mensajeReserva    = document.getElementById('mensaje-reserva')

// No se puede elegir una fecha anterior a hoy
campoFecha.min = new Date().toISOString().split('T')[0]

function mostrarMensaje(contenedor, texto, tipo) {
    contenedor.textContent = texto
    contenedor.className = `mensaje-form mensaje-${tipo}`
    contenedor.style.display = 'block'
    setTimeout(() => { contenedor.style.display = 'none' }, 3500)
}

// ── Cargar las canchas disponibles en el <select> ────────────────────────────
async function cargarCanchasEnSelect() {
    try {
        const respuesta = await fetch('/api/web/canchas')
        const canchas = await respuesta.json()

        canchas
            .filter((cancha) => cancha.disponible)
            .forEach((cancha) => {
                const opcion = document.createElement('option')
                opcion.value = cancha.id
                opcion.textContent = `${cancha.nombre} (${cancha.deporte})`
                campoCancha.appendChild(opcion)
            })

    } catch (error) {
        console.error('Error al cargar canchas:', error)
        mostrarMensaje(mensajeReserva, 'No se pudieron cargar las canchas disponibles.', 'error')
    }
}

function formatearFecha(fechaISO) {
    // fechaISO viene como "YYYY-MM-DD" desde el servidor
    const [anio, mes, dia] = fechaISO.split('-')
    return `${dia}/${mes}/${anio}`
}

// ── Listado de reservas registradas ──────────────────────────────────────────
async function obtenerReservas() {
    try {
        const respuesta = await fetch('/api/web/reservas')

        if (!respuesta.ok) {
            document.getElementById('contenedor-reservas').innerHTML =
                '<p style="color:#6e6e73;font-size:0.95rem;">Las reservas estarán disponibles próximamente.</p>'
            return
        }

        const reservas = await respuesta.json()
        const contenedor = document.getElementById('contenedor-reservas')

        if (reservas.length === 0) {
            contenedor.innerHTML = '<p class="sin-datos">No hay reservas registradas todavía.</p>'
            return
        }

        contenedor.innerHTML = ''

        reservas.map((reserva) => {
            const div = document.createElement('div')
            div.classList.add('card-reserva')
            div.innerHTML = `
                <h3>${reserva.cancha}</h3>
                <p>Usuario: ${reserva.usuario}</p>
                <p>Fecha: ${formatearFecha(reserva.fecha)}</p>
                <p>Hora: ${reserva.hora}</p>
                <span class="${reserva.estado === 'confirmada' ? 'disponible' : 'ocupada'}">
                    ${reserva.estado}
                </span>
            `
            contenedor.appendChild(div)
        })

    } catch (error) {
        console.log(error)
        document.getElementById('contenedor-reservas').innerHTML =
            '<p style="color:#6e6e73;font-size:0.95rem;">Las reservas estarán disponibles próximamente.</p>'
    }
}

// ── Crear una reserva (cualquier visitante, sin necesidad de login) ─────────
formularioReserva.addEventListener('submit', async (e) => {
    e.preventDefault()

    const datos = {
        cancha_id: Number(campoCancha.value),
        usuario:   campoNombre.value.trim(),
        fecha:     campoFecha.value,
        hora:      campoHora.value
    }

    try {
        const respuesta = await fetch('/api/web/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })

        const resultado = await respuesta.json()

        if (!respuesta.ok) {
            // 409 = ya existe una reserva para esa cancha/fecha/hora
            mostrarMensaje(mensajeReserva, resultado.error || 'No se pudo crear la reserva', 'error')
            return
        }

        mostrarMensaje(mensajeReserva, '¡Reserva creada correctamente!', 'exito')
        formularioReserva.reset()
        obtenerReservas()

    } catch (error) {
        console.error('Error al crear la reserva:', error)
        mostrarMensaje(mensajeReserva, 'Error de conexión con el servidor', 'error')
    }
})

// ── Init ──────────────────────────────────────────────────────────────────────
cargarCanchasEnSelect()
obtenerReservas()
