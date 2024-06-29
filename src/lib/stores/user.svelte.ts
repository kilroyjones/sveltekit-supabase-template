// Types
import type { Tables } from '$lib/types/supabase';

function createUserStore() {
	let user: Tables<'users'> | undefined = $state(undefined);

	const set = (updatedUser: Tables<'users'>) => (user = updatedUser);
	const reset = () => (user = undefined);

	return {
		get exists() {
			return user ? true : false;
		},

		get id() {
			return user?.id;
		},

		get email() {
			return user?.email;
		},

		get username() {
			return user?.username;
		},

		get profile_image() {
			return user?.profile_image;
		},

		set,
		reset
	};
}

export const userStore = createUserStore();
