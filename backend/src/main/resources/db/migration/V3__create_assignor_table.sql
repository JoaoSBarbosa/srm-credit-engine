CREATE TABLE assignor (
    id UUID PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    document VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);