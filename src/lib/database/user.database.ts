// Libraries and modules
import { supabaseServerClient } from '$lib/services/supabase.service';

// Types
import type { Tables } from '$lib/types/supabase';
import type { UserInsert, UserUpdate } from '$lib/types/users';

/**
 * Gets the user by id
 *
 * @param id
 * @returns Tables<'users'>
 */
async function getById(id: string): Promise<Tables<'users'> | null> {
	const { data, error } = await supabaseServerClient.from('users').select('*').eq('id', id);

	if (error == null) {
		return data[0];
	}

	console.error('UserDatabase:getById - ', error);
	return null;
}

/**
 * Gets user by email
 *
 * @param id
 * @returns Tables<'users'>
 */
async function getByEmail(email: string): Promise<Tables<'users'> | null> {
	const { data, error } = await supabaseServerClient.from('users').select('*').eq('email', email);

	if (error == null) {
		return data[0];
	}

	console.error('UserDatabase:getByEmail - ', error);
	return null;
}

/**
 * Gets user by username
 *
 * @param id
 * @returns Tables<'users'>
 */
async function getByUsername(username: string): Promise<Tables<'users'> | null> {
	const { data, error } = await supabaseServerClient
		.from('users')
		.select('*')
		.eq('username', username);

	if (error == null) {
		return data[0];
	}

	console.error('UserDatabase:getByUsername - ', error);
	return null;
}

/**
 * Inserts a new user
 *
 * @param userId
 * @param userData
 * @returns Tables<'users'>
 */
async function insert(userData: UserInsert): Promise<Tables<'users'> | null> {
	const { data, error } = await supabaseServerClient.from('users').insert(userData).select();

	if (error == null) {
		return data[0];
	}

	console.error('UserDatabase:insert - ', error);
	return null;
}

/**
 * Updates a user given their id and UserDate

 * @param userId
 * @param userData
 * @returns Tables<'users'>
 */
async function update(userId: string, userData: UserUpdate): Promise<Tables<'users'> | null> {
	const { data, error } = await supabaseServerClient
		.from('users')
		.update(userData)
		.eq('id', userId)
		.select();

	if (error == null) {
		return data[0];
	}

	console.error('UserDatabase:update - ', error);
	return null;
}

export const UserDatabase = {
	getById,
	getByEmail,
	getByUsername,
	insert,
	update
};
