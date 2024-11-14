import { createSignal, JSX, Show } from 'solid-js'
import Auth from '~/components/auth'
import '~/css/layout.css'

export default function () {
	const [accountVisible, setAccountVisible] = createSignal(false);

	return (
		<header class={'layout'}>
			<div>
				<button type='button' onClick={() => setAccountVisible(!accountVisible())} >Account</button>
				<div id='form'>
					<Show when={accountVisible()}>
						<Auth />
					</Show>
				</div>
			</div>
		</header>
	)
}