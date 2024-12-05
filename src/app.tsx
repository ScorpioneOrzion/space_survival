import { Suspense } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router'
import NotFound from '~/errorcodes/404';
import GlobalContext from '~/global/context';
import { MetaProvider } from '@solidjs/meta';

export default function App() {
	return (
		<GlobalContext>
			<Router root={props => (
				<MetaProvider>
					<Suspense children={props.children} />
				</MetaProvider>
			)}>
				<FileRoutes />
				<Route path="*" component={NotFound} />
			</Router>
		</GlobalContext>
	);
}
