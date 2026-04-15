"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import useScrollOnNextQueryChange from "@/hooks/useScrollOnNextQueryChange";

type MeetupListScrollContextValue = {
	markWillChange: () => void;
};

const MeetupListScrollContext = createContext<MeetupListScrollContextValue | null>(null);

export function MeetupListScrollProvider({ children }: { children: ReactNode }) {
	const { scrollAnchorRef, markWillChange } = useScrollOnNextQueryChange({ behavior: "auto" });

	const value = useMemo(() => ({ markWillChange }), [markWillChange]);

	return (
		<MeetupListScrollContext.Provider value={value}>
			<div
				ref={scrollAnchorRef}
				className="pointer-events-none shrink-0 scroll-mt-12 md:scroll-mt-[88px]"
				aria-hidden
			/>
			{children}
		</MeetupListScrollContext.Provider>
	);
}

export function useMeetupListScroll() {
	const ctx = useContext(MeetupListScrollContext);
	if (!ctx) {
		throw new Error("useMeetupListScroll must be used within MeetupListScrollProvider");
	}
	return ctx;
}
