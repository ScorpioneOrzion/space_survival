import { JSX, onMount, ParentProps } from "solid-js"

export default function (prop: ParentProps) {
	console.log('layout')
	return <div>{prop.children}</div>
}