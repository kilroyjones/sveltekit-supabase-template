<script lang="ts">
	// Types and variables
	import { userStore } from '$lib/stores/user.svelte';
	import { PUBLIC_SUPABASE_STORAGE_ENDPOINT } from '$env/static/public';
	import { onMount } from 'svelte';
	import type { Tables } from '$lib/types/supabase';
	import { deserialize } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { enhance } from '$app/forms';

	let user: Tables<'users'> | undefined;
	let formElement: HTMLFormElement;
	let fileInput: any;

	function triggerFileInput() {
		if (fileInput) fileInput.click(); // Safely trigger the file input
	}

	async function handleSubmit(event: Event) {
		event.preventDefault(); // Prevent the form from submitting normally

		const formData = new FormData(formElement);

		if (formData.get('file')) {
			// Submit to the 'upload' action in +page.server.ts
			const response = await fetch('?/upload', {
				method: 'POST',
				body: formData
			});

			const result: ActionResult = deserialize(await response.text());

			if (result.type == 'success') {
				if (result.data) {
					userStore.set(result.data as Tables<'users'>);
				}
			} else {
				console.error('Error uploading new profile image');
			}
		}
	}
</script>

<div class="flex justify-center px-5 mt-10 sm:px-6 lg:px-0">
	<div class="w-full p-6 rounded-lg shadow bg-base-200 sm:w-3/4 lg:w-1/2">
		{#if userStore.exists}
			<div class="flex flex-row items-center">
				<form bind:this={formElement} onsubmit={handleSubmit}>
					<button type="button" class="relative" onclick={triggerFileInput}>
						<div class="w-16 h-16 overflow-hidden border-4 rounded-full border-primary">
							<img
								class="object-cover w-full h-full rounded-full"
								alt="Avatar"
								src="{PUBLIC_SUPABASE_STORAGE_ENDPOINT}/profile_images/{userStore.profile_image}"
								role="none"
							/>
						</div>
						<span
							class="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 text-md transform translate-x-1 translate-y-1.5 border-white rounded-full bg-primary"
							>+</span
						>
					</button>
					<input
						type="file"
						id="file-upload"
						name="file"
						accept="image/*"
						style="display: none;"
						bind:this={fileInput}
						onchange={handleSubmit}
					/>
					<button type="submit" style="display: none;">Submit</button>
				</form>
				<h1 class="pl-5 text-2xl font-bold">{userStore.username}</h1>
			</div>
		{/if}
	</div>
</div>
