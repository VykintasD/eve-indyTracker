CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS tokens (
  access_token VARCHAR,
  refresh_token VARCHAR,
  expires_at INTEGER,
  token_type VARCHAR(50),
  character_id INTEGER REFERENCES characters(id) PRIMARY KEY
)