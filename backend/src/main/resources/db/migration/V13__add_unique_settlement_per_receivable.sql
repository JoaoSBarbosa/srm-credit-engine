ALTER TABLE settlement  ADD CONSTRAINT uq_settlement_receivable UNIQUE (receivable_id);

COMMENT ON CONSTRAINT uq_settlement_receivable ON settlement IS 'Impede mais de uma liquidação para o mesmo recebível, mesmo sob concorrência';