<script lang="ts">
	// Components
	import LoggedIn from './LoggedIn.svelte';
	import LoggedOut from './LoggedOut.svelte';
	import ToggleLightDarkMode from './ToggleLightDarkMode.svelte';

	// Variables
	import { userStore } from '$lib/stores/user.svelte';
</script>

<div class="navbar">
	<div class="flex-1">
		<a href="/" class="text-xl btn btn-ghost">Template</a>
		<div class="flex-none">
			<ToggleLightDarkMode></ToggleLightDarkMode>
		</div>
	</div>

	{#if userStore.exists}
		<LoggedIn profileImage={userStore.profile_image}></LoggedIn>
	{:else}
		<LoggedOut></LoggedOut>
	{/if}
</div>
