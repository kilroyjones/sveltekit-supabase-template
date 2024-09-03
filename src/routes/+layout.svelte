<script lang="ts">
	// Libraries
	import '../app.css';
	import { goto, invalidate } from '$app/navigation';
	import { onMount, type Snippet } from 'svelte';

	// Components
	import Navbar from '$lib/components/navbar/Navbar.svelte';

	// Types
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import type { Tables } from '$lib/types/supabase';

	// Variables
	import { userStore } from '$lib/stores/user.svelte';

	type Props = {
		data: {
			session: Session;
			user: Tables<'users'>;
			supabase: SupabaseClient;
		};
		children: Snippet;
	};

	let { data, children }: Props = $props();
	let { session, user, supabase } = data;

	let mounted = $state(false);

	onMount(async (): Promise<any> => {
		const { data } = supabase.auth.onAuthStateChange(async (_, newSession) => {
			if (!newSession) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				userStore.reset();
				goto('/', { replaceState: true });
				invalidate('/'); // Explicitly invalidate the current page
			}

			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			if (user) {
				userStore.set(user);
				mounted = true;
			}
		});

		mounted = true;
		return () => data.subscription.unsubscribe();
	});
</script>

{#if mounted}
	<Navbar></Navbar>
	{mounted}
	{@render children()}
{/if}
