-- ADD_USER
INSERT INTO users (id, username, password_hash, salt, email)
VALUES (?, ?, ?, ?, ?);
-- GET_USER
SELECT *
FROM users
WHERE id = ?;
-- UPDATE_USER
-- Updates user fields based on provided values (dynamically built in code).
-- INITIALIZE
CREATE TABLE IF NOT EXISTS users (
	id text PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	salt TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL
)