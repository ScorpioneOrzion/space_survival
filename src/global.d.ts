/// <reference types="@solidjs/start/env" />

type LoginProps = {
	update: () => void
	setErrorMessage: (msg: string) => void
}

type UserSession = {
	userId?: number;
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

type PublicUSERACCOUNT = {
	username: string
	capitalize: string
	joined: string
	seen_at: string
}

type PrivateUSERACCOUNT = {
	email: string
	verified: 0 | 1
} & PublicUSERACCOUNT

type USERACCOUNTSTATUS = "DELETED" | "ACTIVE" | "SUSPENDED" | "PENDING"

type InternalUSERACCOUNT = {
	id: number
	password_hash: string
	salt: string
	current_status: USERACCOUNTSTATUS
} & PrivateUSERACCOUNT