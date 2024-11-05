import { createSignal, onCleanup, onMount } from "solid-js";
import isHTMLElement from "~/helper/isHTMLElement";
import createHTMLSignal from "~/helper/createHTMLSignal";

export default function Client() {
	const [canvasRef, setCanvasRef] = createHTMLSignal<HTMLCanvasElement>();
	const [width, setWidth] = createSignal(window.innerWidth)
	const [height, setHeight] = createSignal(window.innerHeight)

	onMount(() => {
		let canvasRefResult = canvasRef()
		if (isHTMLElement(canvasRefResult)) {

		}
	})

	return (
		<div class={"full"}>
			<canvas ref={canvasRef} width={width()} height={height()} />
		</div>
	)
}