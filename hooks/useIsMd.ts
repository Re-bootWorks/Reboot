import { useSyncExternalStore } from "react";

// md 이상 여부를 반환하는 반응형 훅(캘린더 모달에서 사용)
const MEDIA_QUERY = "(min-width:744px)";

const subscribe = (callback: () => void) => {
	const media = window.matchMedia(MEDIA_QUERY);
	media.addEventListener("change", callback);
	return () => media.removeEventListener("change", callback);
};

const getSnapshot = () => {
	return window.matchMedia(MEDIA_QUERY).matches;
};

const getServerSnapshot = () => {
	// 서버에서는 항상 동일 값 반환 (hydration mismatch 방지)
	return false;
};

export function useIsMd() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
