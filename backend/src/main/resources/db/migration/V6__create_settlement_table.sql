CREATE TABLE settlement (
    id UUID PRIMARY KEY,
    receivable_id UUID NOT NULL REFERENCES receivable(id),
    payment_currency_id UUID NOT NULL REFERENCES currency(id),
    present_value DECIMAL(18, 2) NOT NULL CHECK (present_value >= 0),
    applied_exchange_rate NUMERIC(18, 6),
    net_amount DECIMAL(18, 2) NOT NULL CHECK (net_amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'SETTLED',
    created_at TIMESTAMP,
    CONSTRAINT chk_settlement_status CHECK (status IN ('PENDING', 'SETTLED', 'CANCELLED'))

);


CREATE INDEX idx_settlement_created_at ON settlement (created_at DESC);
CREATE INDEX idx_settlement_payment_currency ON settlement (payment_currency_id);

COMMENT ON TABLE settlement IS 'Transacao de liquidacao de um recebivel (precificacao + cambio aplicados)';
COMMENT ON COLUMN settlement.applied_exchange_rate IS 'Taxa congelada no momento da liquidacao';