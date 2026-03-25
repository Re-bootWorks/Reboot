import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "@/features/auth/types";

interface UserStore {
	user: User | null;
	isLoading: boolean;
	isError: boolean;
	setUser: (user: User) => void;
	clearUser: () => void;
	setIsLoading: (isLoading: boolean) => void;
	setIsError: (isError: boolean) => void;
}

export const useUserStore = create<UserStore>()(
	devtools(
		(set) => ({
			user: null,
			isLoading: true,
			isError: false,
			setUser: (user) => set({ user }),
			clearUser: () => set({ user: null }),
			setIsLoading: (isLoading) => set({ isLoading }),
			setIsError: (isError) => set({ isError }),
		}),
		{ name: "UserStore" },
	),
);
