import { Suspense } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router'
import NotFound from '~/errorcodes/404';
import '~/css/app.css'
import GlobalContext from '~/global/context';

export default function App() {
	return (
		<GlobalContext>
			<Router root={props => <Suspense children={props.children} />}>
				<FileRoutes />
				<Route path="*" component={NotFound} />
			</Router>
		</GlobalContext>
	);
}
