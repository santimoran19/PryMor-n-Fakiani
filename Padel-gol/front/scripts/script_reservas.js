async function obtenerReservas() {
    try {
        const respuesta = await fetch('/reservas')
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
        document.getElementById('contenedor-reservas').innerHTML = '<p>Error al cargar las reservas</p>'
    }
}

obtenerReservas()