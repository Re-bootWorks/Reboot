import { useLayoutEffect, useRef, useState } from "react";

type ActiveId = string | null | undefined;

export default function useIndicator(
	listRef: React.RefObject<HTMLUListElement | null>,
	activeId: ActiveId,
) {
	const indicatorRef = useRef<HTMLDivElement>(null);
	const hasClickedRef = useRef(false);
	const [style, setStyle] = useState({ left: 0, width: 0 });

	// 사이즈 및 위치 업데이트
	useLayoutEffect(() => {
		function update() {
			if (!listRef.current) return;
			const tab =
				listRef.current.querySelector<HTMLLIElement>(`[data-id="${activeId}"]`) ??
				(listRef.current.children[0] as HTMLLIElement | undefined);
			if (!tab) return;
			setStyle({ left: tab.offsetLeft, width: tab.clientWidth });
		}

		let timer: ReturnType<typeof setTimeout> | null = null;
		function throttledUpdate() {
			if (timer) return;
			timer = setTimeout(() => {
				update();
				timer = null;
			}, 300);
		}

		update();
		window.addEventListener("resize", throttledUpdate);
		return () => {
			window.removeEventListener("resize", throttledUpdate);
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
		};
	}, [activeId]);

	// 버튼 클릭 직후부터 transition 적용
	function addTransition() {
		if (!hasClickedRef.current && indicatorRef.current) {
			indicatorRef.current.classList.add("transition-[transform,width]", "duration-200");
			hasClickedRef.current = true;
		}
	}

	return { indicatorRef, style, addTransition };
}
