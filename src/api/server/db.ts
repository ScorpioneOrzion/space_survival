import Database from 'better-sqlite3';
import { randomBytes, pbkdf2Sync } from 'crypto';
import fs from 'fs';
import { isServer } from 'solid-js/web';

const statusses = ["ACTIVE", "DELETED", "SUSPENDED", "PENDING"];
const db = new Database(process.env.DATABASE_PATH!)
const sql = fs.readFileSync(new URL('./db.sql', import.meta.url), 'utf-8');

export function toPrivate(obj: InternalUSERACCOUNT): PrivateUSERACCOUNT {
	const { email, verified, username, capitalize, joined, seen_at } = obj
	return { email, verified, username, capitalize, joined, seen_at }
}

export function toFakePrivate(obj: PublicUSERACCOUNT): PrivateUSERACCOUNT {
	return { ...obj, email: " - ", verified: false };
}

export function toPublic(obj: PrivateUSERACCOUNT | InternalUSERACCOUNT): PublicUSERACCOUNT {
	const { username, capitalize, joined, seen_at } = obj
	return { username, capitalize, joined, seen_at }
}

export function isInternalUSERACCOUNT(obj: any): obj is InternalUSERACCOUNT {
	return (
		isPrivateUSERACCOUNT(obj) &&
		'id' in obj &&
		'password_hash' in obj &&
		'salt' in obj &&
		'current_status' in obj &&
		typeof obj.id === 'number' &&
		typeof obj.password_hash === 'string' &&
		typeof obj.salt === 'string' &&
		typeof obj.current_status === 'string' &&
		statusses.includes(obj.current_status)
	);
}

export function isPrivateUSERACCOUNT(obj: any): obj is PrivateUSERACCOUNT {
	return (
		isPublicUSERACCOUNT(obj) &&
		'email' in obj &&
		'verified' in obj &&
		typeof obj.email === 'string' &&
		typeof obj.verified === 'boolean'
	)
}

export function isPublicUSERACCOUNT(obj: any): obj is PublicUSERACCOUNT {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'username' in obj &&
		'capitalize' in obj &&
		'joined' in obj &&
		'seen_at' in obj &&
		typeof obj.username === 'string' &&
		typeof obj.capitalize === 'string' &&
		obj.joined instanceof Date &&
		obj.seen_at instanceof Date
	)
}

export function isUserSession(obj: any): obj is Required<UserSession> {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'userId' in obj &&
		typeof obj.userId === 'number'
	)
}

function isId(obj: any): obj is IDCount {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'maxId' in obj &&
		typeof obj.maxId === 'number'
	)
}

function isIdEmpty(obj: any): obj is { maxId: null } {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'maxId' in obj &&
		obj.maxId === null
	)
}

const sqlCommands: Record<string, string> = {}
const sqlParts = sql.split(/--[^\n]*/).filter(Boolean)
const sqlKeys = sql.match(/--[^\n]*/g)?.map(key => key.replace('--', '').trim()) || []
sqlKeys.forEach((key, index) => {
	let part = sqlParts[index].trim()
	if (part !== '') sqlCommands[key] = part
})

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

export async function generateUserId() {
	const query = sqlCommands['GET_MAX_ID'];
	const stmt = db.prepare(query);
	const result = stmt.get();
	console.debug('Generated UserId result:', result);
	if (isId(result)) {
		return { success: true, id: result.maxId + 1 }
	}
	if (isIdEmpty(result)) {
		return { success: true, id: 1 }
	}
	return {
		success: false, id: -1
	}
}

export function addUser(userName: string, plainPassword: string, email: string): CONFIRM {
	const query = sqlCommands['ADD_USER'];
	try {
		let lowerCase = userName.toLowerCase()
		const stmt = db.prepare(query);
		const { salt, hash } = hashPassword(plainPassword);
		stmt.run(lowerCase, userName, hash, salt, email);
		return { success: true };
	} catch (error) {
		console.error('Error adding user:', error);
		if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string')
			return { success: false, error: error.message };
		return { success: false, error: "Unknown error" }
	}
}

export function getUserName(userName: string): RESPONSE<InternalUSERACCOUNT> {
	if (!isServer) return { success: false, error: "INVALID ACCESS" }
	const query = sqlCommands['GET_USER_NAME'];
	try {
		const stmt = db.prepare(query);
		const user = stmt.get(userName);
		if (isInternalUSERACCOUNT(user)) return { success: true, data: user };
		return { success: false, error: 'User not found' };
	} catch (error) {
		console.error('Error getting user:', error);
		if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string')
			return { success: false, error: error.message };
		return { success: false, error: "Unknown error" }
	}
}

export function getUserId(id: number): RESPONSE<InternalUSERACCOUNT> {
	if (!isServer) return { success: false, error: "INVALID ACCESS" }
	const query = sqlCommands['GET_USER_ID'];
	try {
		const stmt = db.prepare(query);
		const user = stmt.get(id);
		if (isInternalUSERACCOUNT(user)) return { success: true, data: user };
		return { success: false, error: 'User not found' };
	} catch (error) {
		console.error('Error getting user:', error);
		if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string')
			return { success: false, error: error.message };
		return { success: false, error: "Unknown error" }
	}
}

export function initializeDatabase(): CONFIRM {
	if (!isServer) {
		return { success: false, error: "INVALID ACCESS" };
	}

	const query = sqlCommands['INITIALIZE'];
	const queryINDEX = sqlCommands['INDEXING'];

	try {
		// Initialize the database schema
		db.exec(query);

		// Ensure indexes are created if they don't exist
		db.exec(queryINDEX);

		return { success: true };
	} catch (error) {
		console.error('Error initializing DB: ', error);

		// Return an appropriate error message
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}

		return { success: false, error: "Unknown error occurred during DB initialization." };
	}
}