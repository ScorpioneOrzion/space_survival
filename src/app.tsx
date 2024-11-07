import { onMount, Suspense } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router'
import NotFound from '~/errorcodes/404';

export default function App() {
	onMount(() => {
		const hasTitle = document.getElementsByTagName('title').length > 0

		if (!hasTitle) {
			let title = document.createElement('title')
			title.innerText = 'Space Survival'
			document.head.appendChild(title)
		}
	})
	return (
		<Router root={(props) => <Suspense>{props.children}</Suspense>}>
			<FileRoutes />
			<Route path="*" component={NotFound} />
		</Router>
	);
}
