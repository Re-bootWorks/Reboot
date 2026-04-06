import { clientFetch } from "@/libs/clientFetch";
import type { UserPublicProfile } from "@/types/user";

export async function getUserProfile(userId: number): Promise<UserPublicProfile> {
	const res = await clientFetch(`/users/${userId}`);

	if (!res.ok) {
		throw new Error("유저 프로필 조회 실패");
	}

	return res.json();
}
