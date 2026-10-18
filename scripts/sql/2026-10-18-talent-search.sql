-- Faster talent search (run with: npm run db:sql -- scripts/sql/2026-10-18-talent-search.sql).
-- Search used to read every published profile's whole `data` record. These generated columns keep a
-- lowercase copy of what the search filters on; Postgres updates them on every insert and update, so
-- no app code has to remember to. Trigram indexes make "contains" (ILIKE '%…%') searches use an index.
-- Additive and safe to re-run.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE talent_profiles ADD COLUMN IF NOT EXISTS search_name text
  GENERATED ALWAYS AS (lower(full_name)) STORED;
ALTER TABLE talent_profiles ADD COLUMN IF NOT EXISTS search_places text
  GENERATED ALWAYS AS (lower(coalesce((data->'cities')::text, ''))) STORED;
ALTER TABLE talent_profiles ADD COLUMN IF NOT EXISTS search_languages text
  GENERATED ALWAYS AS (lower(coalesce((data->'languages')::text, '') || ' ' || coalesce((data->'accents')::text, ''))) STORED;
ALTER TABLE talent_profiles ADD COLUMN IF NOT EXISTS has_headshot boolean
  GENERATED ALWAYS AS (coalesce(jsonb_array_length(data->'media'->'headshots'), 0) > 0) STORED;

CREATE INDEX CONCURRENTLY IF NOT EXISTS talent_profiles_search_name_trgm ON talent_profiles USING gin (search_name gin_trgm_ops) WHERE published;
CREATE INDEX CONCURRENTLY IF NOT EXISTS talent_profiles_search_places_trgm ON talent_profiles USING gin (search_places gin_trgm_ops) WHERE published;
CREATE INDEX CONCURRENTLY IF NOT EXISTS talent_profiles_search_languages_trgm ON talent_profiles USING gin (search_languages gin_trgm_ops) WHERE published;
-- The result order: profiles with a headshot first, then the most complete
CREATE INDEX CONCURRENTLY IF NOT EXISTS talent_profiles_search_order_idx ON talent_profiles (has_headshot DESC, completeness DESC, full_name) WHERE published;
