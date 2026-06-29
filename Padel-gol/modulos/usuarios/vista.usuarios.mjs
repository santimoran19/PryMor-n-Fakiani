// Estructurar los datos que se envían al cliente.
// Acá no devolvemos nunca el password_hash al front-end, eso se filtra
// directamente en el modelo (el SELECT del login no expone ese campo
// fuera del controlador). Se deja este archivo para mantener la misma
// organización que el módulo de canchas.
