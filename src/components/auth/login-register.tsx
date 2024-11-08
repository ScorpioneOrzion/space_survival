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
				{register() ? "Already" : "Don't"} have an account?{" "}
				<button type="button" onClick={() => {
					setRegister(!register())
					setErrorMessage('')
				}}>
					{register() ? "Log in" : "Register"}
				</button>
			</p>
		</>
	)
}
