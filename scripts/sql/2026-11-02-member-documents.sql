-- Private documents for young performers (birth certificate, guardian ID, consent) and pets (ownership, vaccinations).
-- Kept in the database, not public file storage: only the member and the admin can download them, through /api/documents.
-- Run with: npm run db:sql -- scripts/sql/2026-11-02-member-documents.sql   (not db:push)
CREATE TABLE IF NOT EXISTS member_documents (
  id serial PRIMARY KEY,
  account_id integer NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  kind varchar(40) NOT NULL,
  file_name varchar(200) NOT NULL,
  mime varchar(60) NOT NULL,
  size integer NOT NULL,
  data bytea NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'pending',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
CREATE INDEX IF NOT EXISTS member_documents_account_idx ON member_documents (account_id, created_at);
CREATE INDEX IF NOT EXISTS member_documents_status_idx ON member_documents (status, created_at);
