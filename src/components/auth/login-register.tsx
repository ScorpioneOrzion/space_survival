import { createSignal } from "solid-js";
import Login from "./login";
import Register from "./register";

export default function ({ checkStatus, setErrorMessage }: { checkStatus: () => Promise<void>, setErrorMessage: (msg: string) => void }) {
	const [register, setRegister] = createSignal(false);

	return (
		<>
			{register() ?
				<Register checkStatus={checkStatus} setErrorMessage={setErrorMessage} />
				:
				<Login checkStatus={checkStatus} setErrorMessage={setErrorMessage} />}
			<p>
				{register() ? "Already have an account?" : "Don't have an account?"}&emsp;
				<a href="#" class={"toggle-login"} onClick={e => {
					e.preventDefault()
					setRegister(!register())
					setErrorMessage('')
				}}>{register() ? "Log in" : "Register"}</a>
			</p>
		</>
	)
}
