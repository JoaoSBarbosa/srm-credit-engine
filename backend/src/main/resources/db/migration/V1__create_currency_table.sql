CREATE TABLE currency (
    id UUID PRIMARY KEY,
    isoCode VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);