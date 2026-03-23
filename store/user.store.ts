import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "@/features/auth/types";

interface UserStore {
	user: User | null;
	setUser: (user: User) => void;
	clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
	devtools(
		(set) => ({
			user: null,
			setUser: (user) => set({ user }),
			clearUser: () => set({ user: null }),
		}),
		{ name: "UserStore" },
	),
);
