-- M-Pesa (Pesawise) payments on the new site.
-- provider_ref holds Pesawise's requestId for an STK push, so its callback can be matched to the payment we started.
-- Run with: npm run db:sql -- scripts/sql/2026-10-27-mpesa-payments.sql   (not db:push, see 2026-10-09-member-login.sql)
ALTER TABLE payments ADD COLUMN IF NOT EXISTS provider_ref varchar(80);
CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_ref_idx ON payments (provider_ref) WHERE provider_ref IS NOT NULL;
CREATE INDEX IF NOT EXISTS payments_account_idx ON payments (account_id, created_at);
