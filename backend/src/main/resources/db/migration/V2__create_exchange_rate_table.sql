CREATE TABLE exchange_rate (
    id UUID PRIMARY KEY,
    target_currency_id UUID NOT NULL REFERENCES currency(id),
    source_currency_id UUID NOT NULL REFERENCES currency(id),
    exchange_rate DECIMAL(18, 6) NOT NULL CHECK ( exchange_rate > 0),
    reference_date DATE NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT uq_rate_by_date UNIQUE (target_currency_id, source_currency_id, reference_date)
);


CREATE INDEX idx_exchange_rate_search ON exchange_rate (source_currency_id, target_currency_id, reference_date DESC);