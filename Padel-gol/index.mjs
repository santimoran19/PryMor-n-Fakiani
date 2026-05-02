import express from 'express'

const PUERTO = 3000

const app = express()

app.use(express.static('front'))

// Ruta raiz
app.get('/', (req, res) => {
    res.send('Bienvenidos a Padel & Gol')
})

// Ruta para obtener las canchas desde mockapi
app.get('/canchas', async (req, res) => {
    try {
        const respuesta = await fetch('https://69f008a9112e1b968e252770.mockapi.io/api/v1/canchas')
        const canchas = await respuesta.json()
        res.json(canchas)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'No se pudieron obtener las canchas' })
    }
})

// Ruta para obtener una cancha por id
app.get('/canchas/:id', async (req, res) => {
    try {
        const id = req.params.id
        const respuesta = await fetch(`https://69f008a9112e1b968e252770.mockapi.io/api/v1/canchas${id}`)
        const cancha = await respuesta.json()
        res.json(cancha)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'No se pudo obtener la cancha' })
    }
})

// Ruta para obtener las reservas desde mockapi
app.get('/reservas', async (req, res) => {
    try {
        const respuesta = await fetch('https://69f008a9112e1b968e252770.mockapi.io/api/v1/reservas')
        const reservas = await respuesta.json()
        res.json(reservas)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'No se pudieron obtener las reservas' })
    }
})

app.listen(PUERTO, () => {
    console.log(`servidor corriendo en http://localhost:${PUERTO}`)
})
