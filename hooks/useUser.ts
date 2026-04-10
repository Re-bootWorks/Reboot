import { useGetMe } from "@/features/auth/queries";

export function useUser() {
	const { data: user, isPending, isError } = useGetMe();
	return {
		user: user ?? null,
		isLoggedIn: !!user,
		isPending,
		isError,
	};
}
