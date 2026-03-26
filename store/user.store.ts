import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "@/features/auth/types";

interface UserStore {
	user: User | null;
	isPending: boolean;
	isError: boolean;
	setUser: (user: User) => void;
	clearUser: () => void;
	setIsPending: (isPending: boolean) => void;
	setIsError: (isError: boolean) => void;
}

export const useUserStore = create<UserStore>()(
	devtools(
		(set) => ({
			user: null,
			isPending: true,
			isError: false,
			setUser: (user) => set({ user }),
			clearUser: () => set({ user: null }),
			setIsPending: (isPending) => set({ isPending }),
			setIsError: (isError) => set({ isError }),
		}),
		{ name: "UserStore" },
	),
);
