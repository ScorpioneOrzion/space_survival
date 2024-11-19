import { createSignal } from "solid-js";
import Login from "./component-login";
import Register from "./component-register";

export default function LoginRegister({ update, setErrorMessage }: LoginProps) {
	const [register, setRegister] = createSignal(false);

	return (
		<>
			<div id={"forum"}>
				{register() ?
					<Register update={update} setErrorMessage={setErrorMessage} />
					:
					<Login update={update} setErrorMessage={setErrorMessage} />}
			</div>
			<p>
				{register() ? "Already have an account?" : "Don't have an account?"}&emsp;
				<a href="#" class={"toggle-login"} onClick={e => {
					e.preventDefault()
					setRegister(!register())
				}}>{register() ? "Login" : "Register"}</a>
			</p>
		</>
	)
}
