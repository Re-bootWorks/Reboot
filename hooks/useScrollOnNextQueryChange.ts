"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface UseScrollOnNextQueryChangeProps {
	behavior?: "auto" | "smooth";
}
export default function useScrollOnNextQueryChange<T extends HTMLElement = HTMLDivElement>({
	behavior = "smooth",
}: UseScrollOnNextQueryChangeProps = {}) {
	const searchParams = useSearchParams();
	const searchParamsKey = searchParams.toString();
	const scrollAnchorRef = useRef<T>(null);
	const hasMountedRef = useRef(false);
	const shouldScrollOnNextQueryChangeRef = useRef(false);

	function markWillChange() {
		shouldScrollOnNextQueryChangeRef.current = true;
	}

	useEffect(() => {
		if (!hasMountedRef.current) {
			hasMountedRef.current = true;
			return;
		}

		if (!shouldScrollOnNextQueryChangeRef.current) {
			return;
		}

		shouldScrollOnNextQueryChangeRef.current = false;

		scrollAnchorRef.current?.scrollIntoView({
			behavior,
			block: "start",
		});
	}, [searchParamsKey]);

	return { scrollAnchorRef, markWillChange };
}
