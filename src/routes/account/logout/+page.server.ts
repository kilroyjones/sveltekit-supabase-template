// Libraries and modules
import { redirect } from '@sveltejs/kit';

// Types
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

/**
 * Server load on login checks if user is already logged in.
 */
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.safeGetSession();
	if (session.user == null) {
		redirect(303, '/');
	}
};

/**
 * Logs the user out
 */
export const actions = {
	logout: async ({ locals }) => {
		await locals.supabase.auth.signOut();
	}
} satisfies Actions;
