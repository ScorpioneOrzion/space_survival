import replacer from "./replacer"

export default function (message: any) {
	"use server"
	const readableMessage = JSON.stringify(message, replacer, 4)
	console.log(readableMessage)
}