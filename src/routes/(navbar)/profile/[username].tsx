import { MetaProvider, Title } from "@solidjs/meta";
import { RouteSectionProps, useNavigate } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { getUserInfo } from "~/api/client/user";
import { emptyPrivate, useGlobalContext } from "~/global/context";

export default function (prop: RouteSectionProps) {
	const userName = prop.params.username.toLowerCase()
	const { ready, user: [user] } = useGlobalContext()
	const [targetUser, setTargetUser] = createSignal<PrivateUSERACCOUNT>(emptyPrivate())
	const navigate = useNavigate()

	createEffect(async () => {
		if (ready()) {
			const response = await getUserInfo(userName, user().username)
			if (response.success) {
				setTargetUser(response.data)
			} else if (response.error === "User not found") {
				navigate("/404")
			}
		}
	})

	function timeAgo() {
		const seenAt = new Date(targetUser().seen_at)
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - seenAt.getTime()) / 1000) + now.getTimezoneOffset() * 60;

		if (diffInSeconds < 60) {
			return 'less than a minute';
		} else if (diffInSeconds < 3600) {
			const minutes = Math.floor(diffInSeconds / 60);
			return `${minutes} minute${minutes > 1 ? 's' : ''}`;
		} else if (diffInSeconds < 86400) {
			const hours = Math.floor(diffInSeconds / 3600);
			return `${hours} hour${hours > 1 ? 's' : ''}`;
		} else if (diffInSeconds < 31536000) {
			const days = Math.floor(diffInSeconds / 86400);
			return `${days} day${days > 1 ? 's' : ''}`;
		} else {
			const years = Math.floor(diffInSeconds / 31536000);
			return `${years} year${years > 1 ? 's' : ''}`;
		}
	}

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
							<span id="joined">{targetUser().joined}</span>
						</p>
						<p>
							<strong>Seen: </strong>
							<span id="seen">{timeAgo()}</span> ago
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