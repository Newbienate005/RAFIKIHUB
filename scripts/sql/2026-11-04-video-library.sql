-- Video Library like the old site: the built-in list in lib/data.ts now has all 18 old videos with their
-- old genres. The database still holds the first 8 (copied in on 2026-10-18 with the old categories).
-- This removes those copies so the site shows the built-in 18; the first save in the admin copies them back in.
-- Only rows never edited in the admin are removed, and the marker only goes once no video rows are left,
-- so anything added or changed in the admin stays. Safe to run more than once.
--   npm run db:sql -- scripts/sql/2026-11-04-video-library.sql
DELETE FROM content_items WHERE kind = 'videos' AND updated_at <= created_at + interval '1 minute';
DELETE FROM site_settings WHERE key = 'seeded:videos' AND NOT EXISTS (SELECT 1 FROM content_items WHERE kind = 'videos');
