CREATE TABLE receivable (
    id UUID PRIMARY KEY,
    assignor_id UUID NOT NULL REFERENCES assignor(id),
    receivable_type_id UUID NOT NULL REFERENCES receivable_type(id),
    currency_id UUID NOT NULL REFERENCES currency(id),
    face_value DECIMAL(18, 2) NOT NULL CHECK (face_value > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    due_date DATE NOT NULL,
    operation_date DATE NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT chk_receivable_status CHECK (status IN ('PENDING', 'SETTLED', 'CANCELLED')),
    CONSTRAINT  chk_receivable_dates CHECK (due_date >= operation_date)
);

CREATE INDEX idx_receivable_assignor ON receivable (assignor_id);
CREATE INDEX idx_receivable_pending_by_assignor ON receivable (assignor_id, due_date) WHERE status = 'PENDING';

COMMENT ON TABLE receivable IS 'Tabela recebíveis (títulos/duplicatas) a serem liquidados';
COMMENT ON COLUMN receivable.face_value IS 'Valor de face (nominal) do recebível';
COMMENT ON CONSTRAINT chk_receivable_dates ON receivable IS 'Garante que a data de vencimento não seja anterior à data da operação';