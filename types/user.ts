export type UserPublicProfile = {
	id: number;
	teamId: string;
	email: string;
	name: string;
	companyName?: string;
	image?: string | null;
};
