import { useQuery } from "@tanstack/react-query";
import { clientFetch } from "@/libs/clientFetch";
import { User } from "@/features/auth/types";
async function getMe(): Promise<User> {
	const response = await clientFetch("/users/me");

	if (!response.ok) throw new Error("유저 정보 조회 실패");

	return response.json();
}

export function useGetMe() {
	return useQuery({
		queryKey: ["me"],
		queryFn: getMe,
		retry: false,
		staleTime: 1000 * 60 * 5,
	});
}
