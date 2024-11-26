import { MetaProvider, Title } from "@solidjs/meta";
import { RouteSectionProps, useNavigate } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { getUserInfo } from "~/api/client/user";
import { emptyPrivate, useGlobalContext } from "~/global/context";

export default function (prop: RouteSectionProps) {
	const userName = prop.params.username.toLowerCase()
	const { login, ready, user, update } = useGlobalContext()
	const [targetUser, setTargetUser] = createSignal<PrivateUSERACCOUNT>(emptyPrivate())
	const navigate = useNavigate()
	createEffect(async () => {
		if (ready()) {
			const response = await getUserInfo(userName, user().username)
			if (response.success) {
				setTargetUser(response.data)
			} else if (response.error === "User not found") {
				// navigate("/404")
			}
		}
	})

	return (
		<>
			<MetaProvider>
				<Title>Member</Title>
			</MetaProvider>
			<main>
				<div id="content">
					<div class={"member"}>
						<h1 id="membername">{targetUser().capitalize}</h1>
					</div>
					<section id="stats">
						<p>
							<strong>Joined: </strong>
							<span id="joined"> - </span>
						</p>
						<p>
							<strong>Seen: </strong>
							<span id="seen"> - </span> ago
						</p>
					</section>
					<div id="content-container">
						<section id="accountinfo">
							<p>
								<strong>Email: </strong>
								<span id="email">{targetUser().email}</span>
							</p>
						</section>
					</div>
				</div>
			</main>
		</>
	)
}