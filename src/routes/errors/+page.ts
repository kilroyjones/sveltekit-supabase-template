import type { PageLoad } from './$types';

/**
 * This gets the error and passes it on to the page
 *
 * @param url
 * @returns
 */
export const load: PageLoad = ({ url }) => {
	const error = url.searchParams.get('error');

	return {
		error
	};
};
