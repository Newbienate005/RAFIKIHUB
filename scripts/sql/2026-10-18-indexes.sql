-- Indexes from the ECC database review (run with: npm run db:sql -- scripts/sql/2026-10-18-indexes.sql).
-- Additive only. CONCURRENTLY builds each index without locking the table; IF NOT EXISTS makes re-runs safe.

-- Logins and password resets look accounts up by lower(email); this also stops two accounts
-- differing only by letter case. Checked first: no such duplicates exist.
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS accounts_email_lower_idx ON accounts (lower(email));

-- Joins and filters on columns that had no index
CREATE INDEX CONCURRENTLY IF NOT EXISTS accounts_profile_url_idx ON accounts (profile_url) WHERE profile_url IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS auditions_owner_idx ON auditions (owner_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS auditions_casting_call_idx ON auditions (casting_call_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS applications_applicant_idx ON audition_applications (applicant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS applications_agent_idx ON audition_applications (submitted_by_agent_id) WHERE submitted_by_agent_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS agent_clients_performer_idx ON agent_clients (performer_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS payments_account_idx ON payments (account_id);
