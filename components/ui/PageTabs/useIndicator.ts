import { useLayoutEffect, useRef, useState } from "react";

type ActiveId = string | null | undefined;

export default function useIndicator(
	listRef: React.RefObject<HTMLUListElement | null>,
	activeId: ActiveId,
) {
	const indicatorRef = useRef<HTMLDivElement>(null);
	const hasClickedRef = useRef(false);
	const [style, setStyle] = useState({ left: 0, width: 0 });

	useLayoutEffect(() => {
		function update() {
			if (!listRef.current) return;
			const tab =
				listRef.current.querySelector<HTMLLIElement>(`[data-id="${activeId}"]`) ??
				(listRef.current.children[0] as HTMLLIElement | undefined);
			if (!tab) return;
			setStyle({ left: tab.offsetLeft, width: tab.clientWidth });
		}
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, [activeId]);

	function addTransition() {
		if (!hasClickedRef.current && indicatorRef.current) {
			indicatorRef.current.classList.add("transition-[transform,width]", "duration-200");
			hasClickedRef.current = true;
		}
	}

	return { indicatorRef, style, addTransition };
}
