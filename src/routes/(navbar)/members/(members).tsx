import { MetaProvider, Title } from "@solidjs/meta";
import { A, RouteSectionProps } from "@solidjs/router";
import { createSignal, For, onMount, Show } from "solid-js";

export default function (props: RouteSectionProps) {
	const [members, setMembers] = createSignal<PublicUSERACCOUNT[]>([])

	onMount(async () => {
		const memberList = await fetch("/api/memberList", {
			method: "GET"
		})

		const {data} = await memberList.json()

		setMembers(data)
	})

	return (
		<>
			<MetaProvider>
				<Title>Members</Title>
			</MetaProvider>
			<main>
				<Show when={members().length > 0}>
					<For each={members()}>
						{(item) => <A class={"memberbutton"} href={`/members/${item.username}`}>{item.capitalize}</A>}
					</For>
				</Show>
			</main>
		</>
	)
}