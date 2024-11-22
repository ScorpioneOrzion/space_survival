import { Navigate, RouteSectionProps, useParams } from "@solidjs/router";
import { Show } from "solid-js";
import { useGlobalContext } from "~/global/context";

export default function (prop: RouteSectionProps) {
	const { login, ready, user, update } = useGlobalContext()
	const params = useParams()
	return (
		<>
			<div>{params.id}</div>
			<Show when={ready()}>
				<Show when={!login()} ><Navigate href={"/login"} /></Show>
			</Show>
		</>
	)
}