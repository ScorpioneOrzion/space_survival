-- INITIALIZE
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    capitalize TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    current_status TEXT NOT NULL DEFAULT "ACTIVE",
    verified BOOLEAN DEFAULT FALSE,
    joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- INDEXING
CREATE INDEX IF NOT EXISTS idx_username ON users (username);
-- ADD_USER
INSERT INTO users (username, capitalize, password_hash, salt, email)
VALUES (?, ?, ?, ?, ?);
-- GET_USER_NAME
SELECT *
FROM users
WHERE username = ?;
-- GET_USER_ID
SELECT *
FROM users
WHERE id = ?;
-- UPDATE_SEEN_AT
UPDATE users
SET seen_at = CURRENT_TIMESTAMP
WHERE id = ?;
-- VERIFICATION
UPDATE users
SET verified = TRUE
WHERE id = ?;
-- REMOVE_ACCOUNT
UPDATE users
SET current_status = "DELETED",
    seen_at = CURRENT_TIMESTAMP
WHERE id = ?;
-- REACTIVATE_ACCOUNT
UPDATE users
SET current_status = "ACTIVE",
    seen_at = CURRENT_TIMESTAMP
WHERE id = ?
    AND current_status = "DELETED";