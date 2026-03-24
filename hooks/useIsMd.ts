import { useEffect, useState } from "react";

// md 이상 여부를 반환하는 반응형 훅(모달에서 사용)
export function useIsMd() {
	const [isMd, setIsMd] = useState(false);

	useEffect(() => {
		const media = window.matchMedia("(min-width: 744px)");

		const listener = () => setIsMd(media.matches);
		listener();

		media.addEventListener("change", listener);
		return () => media.removeEventListener("change", listener);
	}, []);

	return isMd;
}
