"use client";

import { useEffect } from "react";
import { useGetMe } from "@/features/auth/queries";
import { useUserStore } from "@/store/user.store";

export function MemberProvider({ children }: { children: React.ReactNode }) {
	const { data: user, isSuccess, isLoading, isError } = useGetMe();
	const { setUser, clearUser, setIsLoading, setIsError } = useUserStore();

	useEffect(() => {
		setIsLoading(isLoading);
		setIsError(isError);

		if (isSuccess && user) {
			setUser(user);
		} else if (!isLoading) {
			clearUser();
		}
	}, [isSuccess, isLoading, isError, user]);

	return <>{children}</>;
}
