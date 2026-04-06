import { clientFetch } from "@/libs/clientFetch";

export type UserPublicProfile = {
	id: number;
	teamId: string;
	email: string;
	name: string;
	companyName: string;
	image: string | null;
};

export async function getUserProfile(userId: number): Promise<UserPublicProfile> {
	const res = await clientFetch(`/users/${userId}`);

	if (!res.ok) {
		throw new Error("유저 프로필 조회 실패");
	}

	return res.json();
}
