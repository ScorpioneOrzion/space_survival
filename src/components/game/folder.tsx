import { A, useParams } from "@solidjs/router";
import { For, ParentProps, Show } from "solid-js";

type FolderComponent = {
	paths: string[]
}

export default function (props: ParentProps<FolderComponent>) {
	const params = useParams()
	const isNotRoot = () => params.path.length > 0
	const href = (item: string) => isNotRoot() ? `${params.path}/${item}` : item
	return (
		<div id="buttonList">
			<Show when={isNotRoot()}>
				<A class={"button"} href={`${params.path}/..`}>..</A>
			</Show>
			<For each={props.paths}>
				{(item) => (
					<A class={"button"} href={href(item)}>{item}</A>
				)}
			</For>
		</div>
	)
}