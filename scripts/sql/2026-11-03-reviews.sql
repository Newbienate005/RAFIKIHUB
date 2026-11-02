-- Reviews: casting directors rate performers, performers rate castings, members rate services.
-- Every review waits for the team (status 'pending') before it shows anywhere public.
CREATE TABLE IF NOT EXISTS reviews (
  id serial PRIMARY KEY,
  author_id integer NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  kind varchar(20) NOT NULL,      -- performer | casting | service
  subject varchar(60) NOT NULL,   -- performer: account id; casting: audition id; service: service id
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body text NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS reviews_once_idx ON reviews (author_id, kind, subject);
CREATE INDEX IF NOT EXISTS reviews_subject_idx ON reviews (kind, subject, status);
CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews (status, created_at);
