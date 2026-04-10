import { serverFetch } from "@/libs/serverFetch";
import { User } from "@/features/auth/types";

export async function getMeServer(): Promise<User> {
	const response = await serverFetch("/users/me");
	if (!response.ok) throw new Error("유저 정보 조회 실패");
	return response.json();
}
