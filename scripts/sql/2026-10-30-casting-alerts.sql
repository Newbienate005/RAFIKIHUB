-- Casting alerts: email matching performers when a casting is published.
-- accounts.casting_alerts: members can turn the emails off (unsubscribe link). auditions.alerted_at: an alert goes out once per casting.
-- Run with: npm run db:sql -- scripts/sql/2026-10-30-casting-alerts.sql   (not db:push)
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS casting_alerts boolean NOT NULL DEFAULT true;
ALTER TABLE auditions ADD COLUMN IF NOT EXISTS alerted_at timestamptz;
-- Castings already live were announced on the old site: don't email about them again if they're reopened
UPDATE auditions SET alerted_at = now() WHERE status = 'published' AND alerted_at IS NULL;
