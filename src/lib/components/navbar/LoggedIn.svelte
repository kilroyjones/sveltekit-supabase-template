<script lang="ts">
	// Variables
	import { PUBLIC_SUPABASE_STORAGE_ENDPOINT } from '$env/static/public';

	export let profileImage: string | undefined;
</script>

<div class="dropdown dropdown-end">
	<div tabindex="0" role="button" class="btn btn-ghost btn-circle profileImage">
		<div class="w-12 h-12 overflow-hidden rounded-full">
			{#if profileImage}
				<img
					class="object-cover w-full h-full border-4 rounded-full border-primary"
					alt="Account profileImage and menu"
					src="{PUBLIC_SUPABASE_STORAGE_ENDPOINT}/profile_images/{profileImage}"
				/>
			{:else}
				<div class="flex items-center justify-center w-full h-full rounded-full bg-primary"></div>
			{/if}
		</div>
	</div>
	<ul class="menu menu-md dropdown-content mt-3 z-[1] p-2 bg-base-100 shadow rounded-box w-52">
		<li><a href="/account/">Account</a></li>
		<li>
			<form method="POST" action="/account/logout?/logout">
				<button type="submit">Logout</button>
			</form>
		</li>
	</ul>
</div>
