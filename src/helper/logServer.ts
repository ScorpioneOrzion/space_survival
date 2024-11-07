const replacer = (key: string, value: unknown) => { if (typeof value === 'bigint') { return value.toString() + 'n'; } return value; };

export default function (message: any) {
	"use server"
	const readableMessage = JSON.stringify(message, replacer, 4)
	console.log(readableMessage)
}