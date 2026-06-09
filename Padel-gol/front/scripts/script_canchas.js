async function obtenerCanchas() {
    try {
        let canchas = []

        if (typeof window !== 'undefined' && window.supabaseClient) {
            try {
                const { data, error } = await window.supabaseClient.from('canchas').select('*')
                if (error) throw error
                canchas = data
            } catch {
                const respuesta = await fetch('/api/web/canchas')
                canchas = await respuesta.json()
            }
        } else {
            const respuesta = await fetch('/api/web/canchas')
            canchas = await respuesta.json()
        }

        const contenedor = document.getElementById('contenedor-canchas')
        contenedor.innerHTML = ''

        canchas.map((cancha) => {
            const div = document.createElement('div')
            div.classList.add('card-cancha')
            div.innerHTML = `
                <h3>${cancha.nombre}</h3>
                <p>Deporte: ${cancha.deporte}</p>
                <p>Precio por hora: $${cancha.precio}</p>
                <p>Capacidad: ${cancha.capacidad} personas</p>
                <span class="${cancha.disponible ? 'disponible' : 'ocupada'}">
                    ${cancha.disponible ? 'Disponible' : 'Ocupada'}
                </span>
            `
            contenedor.appendChild(div)
        })

    } catch (error) {
        console.log(error)
        document.getElementById('contenedor-canchas').innerHTML = '<p>Error al cargar las canchas</p>'
    }
}

obtenerCanchas()
