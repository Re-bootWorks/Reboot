import { useEffect, useRef, useState } from "react";

export default function useDragScroll() {
	const ref = useRef<HTMLDivElement>(null);
	const state = useRef({ isDragging: false, startX: 0, scrollLeft: 0, hasMoved: false });
	const [overflow, setOverflow] = useState({ left: false, right: false });

	const handlers = {
		onMouseDown(e: React.MouseEvent) {
			const el = ref.current;
			if (!el) return;
			state.current = {
				isDragging: true,
				startX: e.clientX,
				scrollLeft: el.scrollLeft,
				hasMoved: false,
			};
		},
		onMouseMove(e: React.MouseEvent) {
			const s = state.current;
			if (!s.isDragging || !ref.current) return;
			const dx = e.clientX - s.startX;
			// 드래그 거리가 3px 이상 이동하면 드래그 상태 업데이트
			if (Math.abs(dx) > 3) s.hasMoved = true;
			ref.current.scrollLeft = s.scrollLeft - dx;
		},
		onMouseUp() {
			state.current.isDragging = false;
		},
		// 드래그 시 버튼 클릭 방지
		onClickCapture(e: React.MouseEvent) {
			if (state.current.hasMoved) {
				e.stopPropagation();
				e.preventDefault();
			}
		},
		// 스크롤 시 overlay 표시 업데이트
		onScroll() {
			const el = ref.current;
			if (!el) return;
			setOverflow({
				left: el.scrollLeft > 0,
				right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
			});
		},
	};

	useEffect(() => {
		handlers.onScroll();
	}, []);

	return { ref, overflow, ...handlers, onMouseLeave: handlers.onMouseUp };
}
