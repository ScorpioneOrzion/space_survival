import Database from 'better-sqlite3';
import { randomBytes, pbkdf2Sync } from 'crypto';
import fs from 'fs';

const db = new Database(process.env.DATABASE_PATH!)
const sql = fs.readFileSync(new URL('./db.sql', import.meta.url), 'utf-8')

const sqlCommands: Record<string, string> = {}
const sqlParts = sql.split(/--[^\n]*/).filter(Boolean)
const sqlKeys = sql.match(/--[^\n]*/g)?.map(key => key.replace('--', '').trim()) || []
sqlKeys.forEach((key, index) => {
	let part = sqlParts[index].trim()
	if (part !== '') sqlCommands[key] = part
})

console.log(sqlCommands)

const ITERATIONS = 100000
const KEY_LENGTH = 64;

function hashPassword(password: string) {
	const salt = randomBytes(16).toString('hex');
	const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex')

	return { salt, hash }
}

export function verifyPassword(password: string, salt: string, hash: string) {
	const derivedHash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex')
	return hash === derivedHash;
}

export function addUser(id: string, userName: string, plainPassword: string, email: string) {
	const query = sqlCommands['ADD_USER'];
	try {
		const stmt = db.prepare(query);
		const { salt, hash } = hashPassword(plainPassword);
		stmt.run(id, userName, hash, salt, email);
		return { success: true };
	} catch (error) {
		console.error('Error adding user:', error);
		if (typeof error === 'object' && error !== null && 'message' in error)
			return { success: false, error: error.message };
	}
}

export function getUser(id: string) {
	const query = sqlCommands['GET_USER'];
	try {
		const stmt = db.prepare(query);
		const user = stmt.get(id);
		if (!user) {
			return { success: false, error: 'User not found' };
		}
		return { success: true, data: user };
	} catch (error) {
		console.error('Error getting user:', error);
		if (typeof error === 'object' && error !== null && 'message' in error)
			return { success: false, error: error.message };
	}
}

export function updateUser(id: string, change: { name?: string; password?: string; email?: string }) {
	const fields: string[] = [];
	const values: any[] = [];

	// Dynamically build the SQL query based on the fields provided
	if (change.name) {
		fields.push("name = ?");
		values.push(change.name);
	}

	if (change.password) {
		const { salt, hash } = hashPassword(change.password); // Regenerate salt and hash if password is updated
		fields.push("password_hash = ?");
		values.push(hash)
		fields.push("salt = ?");
		values.push(salt);
	}

	if (change.email) {
		fields.push("email = ?");
		values.push(change.email);
	}

	if (fields.length === 0) {
		console.log("No fields to update");
		return; // If there are no fields to update, return early
	}

	// Add the user ID to the end of the values array for the WHERE clause
	values.push(id);

	const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

	try {
		const stmt = db.prepare(query);
		stmt.run(...values);
		console.log("User updated successfully");
	} catch (error) {
		console.error("Error updating user:", error);
	}
}

export function initializeDatabase() {
	const query = sqlCommands['INITIALIZE']
	try {
		db.exec(query)
	} catch (error) {
		console.error('Error initializing DB: ', error)
	}
}