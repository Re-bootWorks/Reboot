"use client";

import { create } from "zustand";

interface ModalStore {
	loginOpen: boolean;
	signupOpen: boolean;

	openLogin: () => void;
	closeLogin: () => void;

	openSignup: () => void;
	closeSignup: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
	loginOpen: false,
	signupOpen: false,

	openLogin: () => set({ loginOpen: true }),
	closeLogin: () => set({ loginOpen: false }),

	openSignup: () => set({ signupOpen: true }),
	closeSignup: () => set({ signupOpen: false }),
}));
