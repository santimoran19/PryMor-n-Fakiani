-- Estructura de la base de datos del proyecto Padel & Gol
-- Esto es lo mismo que ejecuta scripts/setup-db.mjs (npm run db:init),
-- se deja también en SQL para poder mirarlo o correrlo a mano si hace falta.

CREATE TABLE IF NOT EXISTS canchas (
    id         SERIAL PRIMARY KEY,
    nombre     VARCHAR(100)   NOT NULL,
    deporte    VARCHAR(50)    NOT NULL,
    precio     NUMERIC(10,2)  NOT NULL CHECK (precio >= 0),
    capacidad  INTEGER        NOT NULL CHECK (capacidad >= 1),
    disponible BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP      DEFAULT NOW(),
    updated_at TIMESTAMP      DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usuarios (
    id            SERIAL PRIMARY KEY,
    usuario       VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    created_at    TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservas (
    id         SERIAL PRIMARY KEY,
    cancha_id  INTEGER      NOT NULL REFERENCES canchas(id) ON DELETE CASCADE,
    usuario    VARCHAR(100) NOT NULL,
    fecha      DATE         NOT NULL,
    hora       TIME         NOT NULL,
    estado     VARCHAR(20)  NOT NULL DEFAULT 'pendiente'
               CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
    created_at TIMESTAMP    DEFAULT NOW()
);
