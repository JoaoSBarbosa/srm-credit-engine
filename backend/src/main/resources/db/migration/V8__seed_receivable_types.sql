INSERT INTO receivable_type (id, name, code, spread_rate, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'Duplicata Mercantil', 'DUPLICATA_MERCANTIL', 0.0150, now(), now()),
    (gen_random_uuid(), 'Cheque Pré-datado',   'CHEQUE_PRE_DATADO',   0.0250, now(), now())
    ON CONFLICT (code) DO NOTHING;