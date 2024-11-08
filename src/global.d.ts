/// <reference types="@solidjs/start/env" />

type UserSession = {
	userId?: number;
};

type SUCCESSRESPONSE = {
	success: true;
	message?: string;
	data?: unknown;
	error?: never;
}

type ERRORRESPONSE = {
	success: false;
	message?: string;
	data?: never;
	error: string;
}

type RESPONSE = SUCCESSRESPONSE | ERRORRESPONSE

type IDCount = {
	maxId: number
}

type USER = {
	id: number
	username: string
	password_hash: string
	salt: string
	email: string
}