import { MetaProvider, Title } from "@solidjs/meta";
import { RouteSectionProps, useParams } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import Folder from "~/components/game/folder";

export default function (props: RouteSectionProps) {
	let params = useParams();
	let [paths, setPaths] = createSignal<string[]>(setPath())

	function setPath() {
		if (params.path.length > 0) {
			return ['a']
		} else {
			return ['a']
		}
	}

	createEffect(() => {
		setPaths(setPath())
	})

	return (
		<>
			<MetaProvider>
				<Title>{params.gameid}</Title>
			</MetaProvider>
			<Folder paths={paths()} />
		</>
	)
}