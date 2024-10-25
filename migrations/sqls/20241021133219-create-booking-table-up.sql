CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT 'user-' || LOWER(REPLACE(CAST(uuid_generate_v4() AS VARCHAR(50)), '-','')),
    username citext UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books (
    id VARCHAR PRIMARY KEY DEFAULT 'book-' || LOWER(REPLACE(CAST(uuid_generate_v4() AS VARCHAR(50)), '-','')),
    title VARCHAR(255) NOT NULL,
    authors TEXT[] NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    published DATE NOT NULL,
    genre TEXT[] NOT NULL,
    summary TEXT,
    cover_image BYTEA,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchases (
    id VARCHAR PRIMARY KEY DEFAULT 'purchase-' || LOWER(REPLACE(CAST(uuid_generate_v4() AS VARCHAR(50)), '-','')),
    user_id VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    book_id VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    purchase_status VARCHAR(50) NOT NULL,
    reference VARCHAR(255) NOT NULL,
    callback_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);