"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import useScrollOnNextQueryChange from "@/hooks/useScrollOnNextQueryChange";

type ReviewsListScrollContextValue = {
	markWillChange: () => void;
};

const ReviewsListScrollContext = createContext<ReviewsListScrollContextValue | null>(null);

export function ReviewsListScrollProvider({ children }: { children: ReactNode }) {
	const { scrollAnchorRef, markWillChange } = useScrollOnNextQueryChange();

	const value = useMemo(() => ({ markWillChange }), [markWillChange]);

	return (
		<ReviewsListScrollContext.Provider value={value}>
			<div
				ref={scrollAnchorRef}
				className="pointer-events-none shrink-0 scroll-mt-12 md:scroll-mt-22"
				aria-hidden
			/>
			{children}
		</ReviewsListScrollContext.Provider>
	);
}

export function useReviewsListScroll() {
	const ctx = useContext(ReviewsListScrollContext);
	if (!ctx) {
		throw new Error("useReviewsListScroll must be used within ReviewsListScrollProvider");
	}
	return ctx;
}
