export type UserUpdate = {
	username?: string;
	email?: string;
	profile_image?: string;
	role?: string;
};

export type UserInsert = {
	id: string;
	username: string;
	email: string;
	profile_image?: string;
	role: string;
};
