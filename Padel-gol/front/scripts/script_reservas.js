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
        contenedor.innerHTML = ''

        reservas.map((reserva) => {
            const div = document.createElement('div')
            div.classList.add('card-reserva')
            div.innerHTML = `
                <h3>${reserva.cancha}</h3>
                <p>Usuario: ${reserva.usuario}</p>
                <p>Fecha: ${reserva.fecha}</p>
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

obtenerReservas()
