CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS tokens (
  accessToken VARCHAR,
  refreshToken VARCHAR,
  expiresAt INTEGER,
  tokenType VARCHAR(50),
  characterId INTEGER REFERENCES characters(id) PRIMARY KEY
)