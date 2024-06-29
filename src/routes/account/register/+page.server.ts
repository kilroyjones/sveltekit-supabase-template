//  Libraries
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';

// Types and constants
import type { Actions } from '@sveltejs/kit';
import type { ErrorRegisterUser } from '$lib/types/account';
import type { PageServerLoad } from './$types';
import type { Tables } from '$lib/types/supabase';

// Variables
import { UserDatabase } from '$lib/database/user.database';
import { PRIVATE_SUPABASE_OAUTH_REDIRECT } from '$env/static/private';
import { PUBLIC_ADDRESS } from '$env/static/public';

/**
 * Server load on registration checks if user is already logged in and redirects
 * to home page, otherwise returns auth providers if they exist.
 */
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.safeGetSession();
	if (session.user) {
		redirect(303, '/');
	}
};

/**
 * Registration action
 */
export const actions = {
	/**
	 * Email registration
	 */
	email: async ({ locals, request }) => {
		// Using the service role client
		const supabase = locals.supabase;

		// Get form data
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const passwordConfirm = formData.get('passwordConfirm') as string;

		// Check if the email or username has been used.
		const userEmail = await UserDatabase.getByEmail(email);
		const userUsername = await UserDatabase.getByUsername(username);

		let errors: ErrorRegisterUser = {};

		if (userEmail) {
			errors.email = 'Email already in use.';
		} else if (userUsername) {
			errors.username = 'Username already in use.';
		} else if (password != passwordConfirm) {
			errors.password = 'Passwords do not match';
		}

		// Check the errors objects to see if any exist
		if (Object.keys(errors).length > 0) {
			return fail(500, { errors: errors });
		}

		let user: Tables<'users'> | null = null;

		const { data, error: error } = await supabase.auth.signUp({ email, password });

		// Insert user if all the necessary data has been inserted during sign up.
		if (data && data.user && data.user.email && data.user.user_metadata.email) {
			user = await UserDatabase.insert({
				id: data.user.id,
				email: data.user.email,
				username: data.user.email,
				profile_image: 'default-avatar.jpg',
				role: 'user'
			});
		}

		if (error || user == null) {
			// If there was an error or we couldn't create the additional 'users' data
			// then rollback the user creation.
			if (data && data.user) {
				await supabase.auth.admin.deleteUser(data.user.id);
			}
			return redirect(303, '/errors');
		} else {
			throw redirect(302, '/account/login');
		}
	},

	/**
	 * Google OAuth2
	 *
	 * We get the provider from list of possible providers (set in Pocketbase) by
	 * name and then set the cookie. If valid, we concat Google's auth url with
	 * the redirect set in Google console as well as our provider name see
	 * /account/oauth/google route.
	 *
	 * @param param0
	 */
	google: async ({ locals }) => {
		const { data, error: err } = await locals.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				scopes: 'https://www.googleapis.com/auth/userinfo.email',
				redirectTo: `${PUBLIC_ADDRESS}/${PRIVATE_SUPABASE_OAUTH_REDIRECT}/google`
			}
		});

		if (err) {
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, {
					error: 'Invalid credentials'
				});
			}
			return fail(500, {
				message: 'Server error. Try again later.'
			});
		}

		throw redirect(303, data.url);
	}
} satisfies Actions;
