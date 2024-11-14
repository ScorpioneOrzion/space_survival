import { createSignal } from "solid-js";
import Login from "./login";
import Register from "./register";

export default function LoginRegister({ checkStatus, setErrorMessage }: { checkStatus: () => Promise<void>, setErrorMessage: (msg: string) => void }) {
	const [register, setRegister] = createSignal(false);

	return (
		<>
			<div id={"forum"}>
				{register() ?
					<Register checkStatus={checkStatus} setErrorMessage={setErrorMessage} />
					:
					<Login checkStatus={checkStatus} setErrorMessage={setErrorMessage} />}
			</div>
			<p>
				{register() ? "Already have an account?" : "Don't have an account?"}&emsp;
				<a href="#" class={"toggle-login"} onClick={e => {
					e.preventDefault()
					console.log(register())
					setRegister(!register())
					setErrorMessage('')
				}}>{register() ? "Login" : "Register"}</a>
			</p>
		</>
	)
}
