import { createSignal } from "solid-js";

export default function createHTMLSignal<T extends HTMLElement>() {
	return createSignal<T | null>(null);
}