"use client";

import { useSyncExternalStore } from "react";

/**
 * 전달받은 media query 문자열과 현재 viewport가 일치하는지 반환합니다.
 *
 * @example
 * const isDesktop = useMediaQuery("(min-width: 1280px)");
 */
export default function useMediaQuery(query: string) {
	const subscribe = (callback: () => void) => {
		const mediaQueryList = window.matchMedia(query);
		mediaQueryList.addEventListener("change", callback);

		return () => mediaQueryList.removeEventListener("change", callback);
	};

	const getSnapshot = () => {
		return window.matchMedia(query).matches;
	};

	const getServerSnapshot = () => {
		// 서버에서는 window에 접근할 수 없으므로 고정값을 반환 (hydration mismatch 방지)
		return false;
	};

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
