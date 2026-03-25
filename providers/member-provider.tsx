"use client";

import { useEffect } from "react";
import { useGetMe } from "@/features/auth/queries";
import { useUserStore } from "@/store/user.store";

export function MemberProvider({ children }: { children: React.ReactNode }) {
	const { data: user, isSuccess, isPending, isError } = useGetMe();
	const { setUser, clearUser, setIsPending, setIsError } = useUserStore();

	useEffect(() => {
		setIsPending(isPending);
		setIsError(isError);

		if (isSuccess && user) {
			setUser(user);
		} else if (!isPending) {
			clearUser();
		}
	}, [isSuccess, isPending, isError, user]);

	return <>{children}</>;
}
