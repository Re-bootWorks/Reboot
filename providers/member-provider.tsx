"use client";

import { useEffect } from "react";
import { useGetMe } from "@/features/auth/queries";
import { useUserStore } from "@/store/user.store";

export function MemberProvider({ children }: { children: React.ReactNode }) {
	const { data: user, isSuccess } = useGetMe();
	const { setUser, clearUser } = useUserStore();

	useEffect(() => {
		if (isSuccess && user) {
			setUser(user);
		} else {
			clearUser();
		}
	}, [isSuccess, user]);

	return <>{children}</>;
}
