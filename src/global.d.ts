/// <reference types="@solidjs/start/env" />

type LoginProps = {
	update: () => void
	setErrorMessage: (msg: string) => void
}

type UserSession = {
	userId: number;
};

type CONFIRMRESPONSE = {
	success: true
}

type SUCCESSRESPONSE<T> = {
	success: true;
	data: T;
}

type ERRORRESPONSE = {
	success: false;
	error: string;
}

type RESPONSE<T = unknown> = SUCCESSRESPONSE<T> | ERRORRESPONSE
type CONFIRM = CONFIRMRESPONSE | ERRORRESPONSE

type IDCount = {
	maxId: number
}

type USERACCOUNT = {
	username: string
	email: string
}

type USER = {
	id: number
	password_hash: string
	salt: string
} & USERACCOUNT