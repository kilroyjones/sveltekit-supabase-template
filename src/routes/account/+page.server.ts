// Libraries and modules
import { ImageService } from '$lib/services/image.service';
import { UserDatabase } from '$lib/database/user.database';

// Types and constants
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Server load on registration checks if user is already logged in and redirects
 * to home page, otherwise returns auth providers if they exist.
 */
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.safeGetSession();
	if (session.user == null) {
		redirect(303, '/');
	}
};

/**
 * Registration action
 */
export const actions = {
	/**
	 * Upload action for profile image
	 */
	upload: async ({ locals, request }) => {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (file) {
			const profileImage = await ImageService.uploadProfileImage(file);
			const { user } = await locals.safeGetSession();
			if (user && profileImage) {
				const updatedUser = await UserDatabase.update(user.id, {
					profile_image: profileImage
				});
				return updatedUser;
			}
		}
	}
} satisfies Actions;
