DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='currency' AND column_name='isoCode') THEN
ALTER TABLE currency RENAME COLUMN "isoCode" TO iso_code;
ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='currency' AND column_name='isocode') THEN
ALTER TABLE currency RENAME COLUMN isocode TO iso_code;
END IF;
END $$;

ALTER TABLE currency
ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE currency
ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';