import { createSignal } from 'solid-js';

export default function ({ placeholder }: { placeholder: string }) {
	const [showPassword, setShowPassword] = createSignal(false); // Track password visibility

	// Function to toggle password visibility
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword());
	};

	return (
		<div class={"password-container"}>
			<input
				type={showPassword() ? "text" : "password"} // Toggle between text and password
				placeholder={placeholder}
				class={"password-input"}
			/>
			<button
				class={"toggle-password"}
				type="button"
				onClick={togglePasswordVisibility}
			>
				{showPassword() ? (
					<svg width="20" height="20" viewBox="0 0 24 24">
						<path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm3-7h-6v2h6v-2zm0 4h-6v2h6v-2z" />
					</svg>
				) : (
					<svg width="20" height="20" viewBox="0 0 24 24">
						<path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm3-7h-6v2h6v-2zm0 4h-6v2h6v-2z" />
					</svg>
				)}
			</button>
		</div>
	);
}
