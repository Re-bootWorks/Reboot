"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import useScrollOnNextQueryChange from "@/hooks/useScrollOnNextQueryChange";

type FavoritesListScrollContextValue = {
	markWillChange: () => void;
};

const FavoritesListScrollContext = createContext<FavoritesListScrollContextValue | null>(null);

export function FavoritesListScrollProvider({ children }: { children: ReactNode }) {
	const { scrollAnchorRef, markWillChange } = useScrollOnNextQueryChange();

	const value = useMemo(() => ({ markWillChange }), [markWillChange]);

	return (
		<FavoritesListScrollContext.Provider value={value}>
			<div
				ref={scrollAnchorRef}
				className="pointer-events-none shrink-0 scroll-mt-12 md:scroll-mt-22"
				aria-hidden
			/>
			{children}
		</FavoritesListScrollContext.Provider>
	);
}

export function useFavoritesListScroll() {
	const ctx = useContext(FavoritesListScrollContext);
	if (!ctx) {
		throw new Error("useFavoritesListScroll must be used within FavoritesListScrollProvider");
	}
	return ctx;
}
