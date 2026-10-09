-- Member login: wrong-password lockout columns and one-time password reset links.
-- Additive and safe to run more than once. Applied by hand (npm run db:sql -- <file>) because drizzle-kit 0.30
-- misreads PostgreSQL 18's named NOT NULL constraints and tries to drop them on `db:push`.

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS failed_logins integer NOT NULL DEFAULT 0;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS locked_until timestamp with time zone;

CREATE TABLE IF NOT EXISTS password_resets (
  id serial PRIMARY KEY,
  account_id integer NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  token_hash varchar(64) NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS password_resets_account_idx ON password_resets (account_id, created_at);

-- If password_resets already existed without its link to accounts, add it (named the way drizzle names it)
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'password_resets_account_id_accounts_id_fk') THEN ALTER TABLE password_resets ADD CONSTRAINT password_resets_account_id_accounts_id_fk FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE; END IF; END $$;
