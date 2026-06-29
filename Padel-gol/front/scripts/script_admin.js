const API_URL = '/api/canchas'

// ── Referencias DOM — formulario de alta ─────────────────────────────────────
const formulario = document.getElementById('form-cancha')
const campoId = document.getElementById('campo-id')
const campoNombre = document.getElementById('campo-nombre')
const campoDeporte = document.getElementById('campo-deporte')
const campoPrecio = document.getElementById('campo-precio')
const campoCapacidad = document.getElementById('campo-capacidad')
const campoDisponible = document.getElementById('campo-disponible')
const mensajeForm = document.getElementById('mensaje-form')
const contenedorTabla = document.getElementById('contenedor-tabla')

// ── Referencias DOM — modal de edición ───────────────────────────────────────
const modalOverlay = document.getElementById('modal-overlay')
const formEditar = document.getElementById('form-editar')
const modalId = document.getElementById('modal-id')
const modalNombre = document.getElementById('modal-nombre')
const modalDeporte = document.getElementById('modal-deporte')
const modalPrecio = document.getElementById('modal-precio')
const modalCapacidad = document.getElementById('modal-capacidad')
const modalDisponible = document.getElementById('modal-disponible')
const mensajeModal = document.getElementById('mensaje-modal')
const btnModalCerrar = document.getElementById('btn-modal-cerrar')
const btnModalCancelar = document.getElementById('btn-modal-cancelar')

// ── Utilidades ────────────────────────────────────────────────────────────────

function mostrarMensaje(contenedor, texto, tipo) {
    contenedor.textContent = texto
    contenedor.className = `mensaje-form mensaje-${tipo}`
    contenedor.style.display = 'block'
    setTimeout(() => { contenedor.style.display = 'none' }, 3000)
}

function abrirModal() {
    modalOverlay.classList.add('activo')
    document.body.style.overflow = 'hidden'
}

function cerrarModal() {
    modalOverlay.classList.remove('activo')
    document.body.style.overflow = ''
    formEditar.reset()
    mensajeModal.style.display = 'none'
}

// ── Tabla ─────────────────────────────────────────────────────────────────────

async function cargarTabla() {
    try {
        const respuesta = await fetch(API_URL)
        const canchas = await respuesta.json()

        if (canchas.length === 0) {
            contenedorTabla.innerHTML = '<p class="sin-datos">No hay canchas registradas todavía.</p>'
            return
        }

        let html = `
            <table class="admin-tabla">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Deporte</th>
                        <th>Precio/hora</th>
                        <th>Capacidad</th>
                        <th>Disponible</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `

        canchas.forEach((cancha) => {
            html += `
        <tr>
            <td>${cancha.nombre}</td>
            <td>${cancha.deporte}</td>
            <td>$${cancha.precio}</td>
            <td>${cancha.capacidad} personas</td>
            <td>
                <span class="${cancha.disponible ? 'disponible' : 'ocupada'}">
                    ${cancha.disponible ? 'Sí' : 'No'}
                </span>
            </td>
            <td>
                <div class="td-acciones">
                    <button class="btn-accion btn-editar" data-id="${cancha.id}">Editar</button>
                    <button class="btn-accion btn-eliminar" data-id="${cancha.id}">Eliminar</button>
                </div>
            </td>
        </tr>
    `
        })

        html += '</tbody></table>'
        contenedorTabla.innerHTML = html
        asignarEventosBotones()

    } catch (error) {
        console.error('Error al cargar la tabla:', error)
        contenedorTabla.innerHTML = '<p class="error-carga">Error al cargar las canchas.</p>'
    }
}

function asignarEventosBotones() {
    document.querySelectorAll('.btn-editar').forEach((btn) => {
        btn.addEventListener('click', () => abrirModalEdicion(btn.dataset.id))
    })
    document.querySelectorAll('.btn-eliminar').forEach((btn) => {
        btn.addEventListener('click', () => confirmarEliminacion(btn.dataset.id))
    })
}

// ── Modal de edición ──────────────────────────────────────────────────────────

async function abrirModalEdicion(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`)
        const cancha = await respuesta.json()

        modalId.value = cancha.id
        modalNombre.value = cancha.nombre
        modalDeporte.value = cancha.deporte
        modalPrecio.value = cancha.precio
        modalCapacidad.value = cancha.capacidad
        modalDisponible.checked = cancha.disponible

        abrirModal()

    } catch (error) {
        console.error('Error al cargar cancha para editar:', error)
        mostrarMensaje(mensajeForm, 'No se pudieron cargar los datos.', 'error')
    }
}

formEditar.addEventListener('submit', async (e) => {
    e.preventDefault()

    const id = modalId.value
    const datos = {
        nombre: modalNombre.value.trim(),
        deporte: modalDeporte.value,
        precio: Number(modalPrecio.value),
        capacidad: Number(modalCapacidad.value),
        disponible: modalDisponible.checked
    }

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })

        if (!respuesta.ok) {
            const err = await respuesta.json()
            throw new Error(err.detalle || 'Error al guardar')
        }

        cerrarModal()
        mostrarMensaje(mensajeForm, 'Cancha actualizada correctamente.', 'exito')
        cargarTabla()

    } catch (error) {
        console.error('Error al actualizar:', error)
        mostrarMensaje(mensajeModal, `Error: ${error.message}`, 'error')
    }
})

btnModalCerrar.addEventListener('click', cerrarModal)
btnModalCancelar.addEventListener('click', cerrarModal)
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) cerrarModal() })
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal() })

// ── Eliminar ──────────────────────────────────────────────────────────────────

function confirmarEliminacion(id) {
    if (confirm('¿Seguro que querés eliminar esta cancha? Esta acción no se puede deshacer.')) {
        eliminarCancha(id)
    }
}

async function eliminarCancha(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        if (!respuesta.ok) throw new Error('Error al eliminar')
        mostrarMensaje(mensajeForm, 'Cancha eliminada correctamente.', 'exito')
        cargarTabla()
    } catch (error) {
        console.error('Error al eliminar:', error)
        mostrarMensaje(mensajeForm, 'No se pudo eliminar la cancha.', 'error')
    }
}

// ── Alta ──────────────────────────────────────────────────────────────────────

formulario.addEventListener('submit', async (e) => {
    e.preventDefault()

    const datos = {
        nombre: campoNombre.value.trim(),
        deporte: campoDeporte.value,
        precio: Number(campoPrecio.value),
        capacidad: Number(campoCapacidad.value),
        disponible: campoDisponible.checked
    }

    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })

        if (!respuesta.ok) {
            const err = await respuesta.json()
            throw new Error(err.detalle || 'Error al crear')
        }

        mostrarMensaje(mensajeForm, 'Cancha creada correctamente.', 'exito')
        formulario.reset()
        cargarTabla()

    } catch (error) {
        console.error('Error al crear cancha:', error)
        mostrarMensaje(mensajeForm, `Error: ${error.message}`, 'error')
    }
})

// ── Init ──────────────────────────────────────────────────────────────────────
cargarTabla()

// ── Cerrar sesión ─────────────────────────────────────────────────────────────
const btnLogout = document.getElementById('btn-logout')

btnLogout.addEventListener('click', async () => {
    try {
        await fetch('/logout', { method: 'POST' })
    } catch (error) {
        console.error('Error al cerrar sesión:', error)
    } finally {
        // Redirección dentro de la propia interfaz
        window.location.href = 'login.html'
    }
})
