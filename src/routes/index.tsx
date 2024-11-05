import { clientOnly } from '@solidjs/start';
const ClientOnly = clientOnly(() => import('../components/client'))

export default function Client() {
	return <ClientOnly />
}