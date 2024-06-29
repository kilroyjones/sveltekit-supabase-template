<script lang="ts">
	// Libraries and modules
	import { applyAction } from '$app/forms';
	import { deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	// Components
	import Google from '$lib/components/svgs/Google.svelte';

	// Types
	import type { ActionResult } from '@sveltejs/kit';

	let email = '';
	let password = '';
	let error = '';

	/**
	 * Custom submit action
	 *
	 * The currentTarget is the form being submited. It called the action on the server
	 * side then checks the result. If the result is a redirect
	 *
	 * @param event
	 */
	const handleSubmit = async (event: { currentTarget: EventTarget & HTMLFormElement }) => {
		const formData = new FormData(event.currentTarget);
		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: formData
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'redirect') {
			await invalidateAll();
			await applyAction(result);
		} else if (result.type == 'failure') {
			error = 'Invalid username or password';
		} else {
			error = 'An unknown error occurred';
		}
	};

	/**
	 * Simply removes the error in case user tries to retype password or
	 * username after an error has occurred.
	 *
	 * @param event
	 */
	const handleKeyboardInput = (event: KeyboardEvent) => {
		error = '';
	};
</script>

<div class="flex flex-col items-center min-h-screen lg:mt-20 md:mt-20">
	<div class="w-full max-w-md px-8 py-6 rounded-xl bg-base-200">
		<h3 class="mt-4 mb-4 text-3xl font-bold text-center">Login</h3>

		<form action="?/email" class="gap-2 p-4 rounded form-control" on:submit={handleSubmit}>
			<div>
				<label for="email" class="block mb-1 text-sm font-medium">Email</label>
				<input
					type="email"
					placeholder="Email"
					name="email"
					class="std-input-field"
					on:keydown={handleKeyboardInput}
					bind:value={email}
				/>
			</div>

			<div class="mt-4">
				<label for="password" class="block mb-1 text-sm font-medium">Password</label>
				<input
					type="password"
					placeholder="Password"
					name="password"
					class="std-input-field"
					on:keydown={handleKeyboardInput}
					bind:value={password}
				/>
			</div>

			<div class="flex justify-center mt-2">
				<p class="std-input-error">{error}</p>
			</div>

			<div class="flex justify-center mt-1">
				<button class="px-6 py-2 leading-5 std-input-button">Login</button>
			</div>
		</form>

		<div class="pt-4">
			<hr />
		</div>

		<form
			action="?/google"
			class="gap-2 p-4 rounded form-control"
			method="POST"
			on:submit|preventDefault={handleSubmit}
		>
			<Google buttonText={'Login with Google'}></Google>
		</form>
	</div>
</div>
