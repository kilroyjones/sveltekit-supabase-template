// Libraries and modules
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { supabaseServerClient } from '$lib/services/supabase.service';
import { UserDatabase } from '$lib/database/user.database';

// Types
import type { Tables } from '$lib/types/supabase';

/**
 * Called to complete the user signing with Google
 * @param event
 */
export const GET: RequestHandler = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;

	// Retrieves the unique value (code) used in the sign in process as well as
	// the redirect route.
	const code = url.searchParams.get('code') as string;
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		let user: Tables<'users'> | null;

		const supabaseClient = event.locals.supabase;
		const supabaseServer = supabaseServerClient;

		// Checks that the code is valid (PKCE - proof key for exchange)
		const codeResult = await supabaseClient.auth.exchangeCodeForSession(code);
		if (codeResult.error) {
			throw redirect(303, '/auth/auth-code-error');
		}

		// There should be a session created at this point which contains the user
		// metadata from Google
		const session = await event.locals.safeGetSession();
		if (session.user == null) {
			throw redirect(303, '/auth/session-not-found');
		}

		// Check to see if this user has already signed in previously
		user = await UserDatabase.getById(session.user.id);

		// If the user doesn't exist then create an entry in our own user tables
		// (not the private, inaccessible one supabase uses)
		if (user == null) {
			if (session.user.id && session.user.email) {
				user = await UserDatabase.insert({
					id: session.user.id,
					email: session.user.email,
					username: session.user.email,
					profile_image: 'default-avatar.jpg',
					role: 'user'
				});
			}
		}

		// If user still equals null, then we've had an error
		if (user == null) {
			throw redirect(303, '/errors?error=Failed to create user');
		}

		// Success, reroute the user to the desired location
		throw redirect(303, `/${next.slice(1)}`);
	}

	throw redirect(303, '/errors?error=Failure with Google auth server');
};
