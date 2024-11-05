export default function isHTMLElement(element: any): element is HTMLElement {
	return element instanceof HTMLElement;
}
