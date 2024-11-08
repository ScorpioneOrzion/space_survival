import { Suspense } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router'
import NotFound from '~/errorcodes/404';

export default function App() {
	return (
		<Router root={(props) => <Suspense>{props.children}</Suspense>}>
			<FileRoutes />
			<Route path="*" component={NotFound} />
		</Router>
	);
}
