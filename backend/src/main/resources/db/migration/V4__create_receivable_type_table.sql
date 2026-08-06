CREATE TABLE receivable_type (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    spread_rate DECIMAL(6, 4) NOT NULL CHECK (spread_rate >= 0),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

COMMENT ON TABLE receivable_type IS 'Categorias de recebivel e seu spread de risco (a.m.)';
COMMENT ON COLUMN receivable_type.code IS 'Chave estavel usada pelo Strategy Pattern (ex: DUPLICATA_MERCANTIL)';