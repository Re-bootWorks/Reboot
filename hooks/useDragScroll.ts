import {
	createElement,
	Fragment,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type CSSProperties,
	type DragEvent,
	type MouseEvent,
	type PointerEvent,
	type ReactNode,
} from "react";

interface UseDragScrollOptions {
	/** 페이드 배경색 @default "#F6F7F9" */
	fadeColor?: string;
	/** 페이드 너비(px) @default 40 */
	fadeWidth?: number;
}
/**
 * @example
 * const { ref, style, overlays, ...events } = useDragScroll<HTMLUListElement>();
 * return (
 *   <div className="relative">
 *     <ul ref={ref} className={containerStyle} style={style} {...events}>
 *       {children}
 *     </ul>
 *     {overlays}
 *   </div>
 * );
 */
export default function useDragScroll<T extends HTMLElement = HTMLDivElement>(
	options?: UseDragScrollOptions,
) {
	const { fadeColor = "#F6F7F9", fadeWidth = 40 } = options ?? {};
	const ref = useRef<T>(null);
	const raf = useRef(0);
	const drag = useRef({
		/** 현재 포인터 눌림 여부 */
		down: false,
		/** 현재 드래그 진행 여부 */
		scrolling: false,
		/** 누른 순간의 clientX 좌표 */
		startX: 0,
		/** 누른 순간의 scrollLeft 좌표 */
		startLeft: 0,
		/** 드래그 발생 여부 (브라우저 기본 클릭 이벤트 방지) */
		suppressClick: false,
	});
	// 컨테이너 좌우 스크롤 여부
	const [overflow, setOverflow] = useState({ left: false, right: false });

	// 컨테이너 좌우 스크롤 여부 저장
	const syncOverflow = useCallback(() => {
		if (ref.current) setOverflow(getOverflow(ref.current));
	}, []);

	// 포인터 눌림 이벤트
	function onPointerDown(e: PointerEvent<T>) {
		const el = ref.current;
		if (!el || e.button !== 0) return;
		drag.current = {
			down: true,
			scrolling: false,
			startX: e.clientX,
			startLeft: el.scrollLeft,
			suppressClick: false,
		};
	}

	// 포인터 이동 이벤트
	function onPointerMove(e: PointerEvent<T>) {
		const el = ref.current;
		const d = drag.current;
		if (!d.down || !el) return;

		const dx = e.clientX - d.startX;
		if (!d.scrolling) {
			// 드래그 거리가 작을 때 스크롤 방지
			if (Math.abs(dx) < DRAG_ACTIVATE_PX) return;
			d.scrolling = true;
			d.suppressClick = true;
		}
		el.scrollLeft = d.startLeft - dx;
	}

	// 포인터 떼기 이벤트
	function onPointerUp() {
		// suppressClick 은 true 상태
		drag.current.down = false;
		drag.current.scrolling = false;
	}

	// 브라우저 클릭 기본 이벤트 방지
	function onClickCapture(e: MouseEvent) {
		if (drag.current.suppressClick) {
			e.stopPropagation();
			e.preventDefault();
		}
	}

	// 스크롤 이벤트
	function onScroll() {
		cancelAnimationFrame(raf.current);
		raf.current = requestAnimationFrame(syncOverflow);
	}

	// 드래그 시작 이벤트
	function onDragStart(e: DragEvent<T>) {
		e.preventDefault();
	}

	// 최초 로드 시 컨테이너 overflow 상태 적용
	useLayoutEffect(syncOverflow, [syncOverflow]);
	// 컴포넌트 언마운트 시 애니메이션 cleanup
	useEffect(() => () => cancelAnimationFrame(raf.current), []);

	// 컨테이너 좌우 오버레이 요소
	const overlays = useMemo(
		() => buildoverlays(overflow, fadeColor, fadeWidth),
		[overflow.left, overflow.right, fadeColor, fadeWidth],
	);

	return {
		ref,
		overflow,
		overlays,
		style: surfaceStyle,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerLeave: onPointerUp,
		onPointerCancel: onPointerUp,
		onClickCapture,
		onScroll,
		onDragStart,
	};
}
const surfaceStyle: CSSProperties = {
	userSelect: "none",
	WebkitUserDrag: "none",
} as CSSProperties;

export const containerStyle =
	"overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const DRAG_ACTIVATE_PX = 6;

// 컨테이너 좌우 스크롤 여부 계산
function getOverflow(el: HTMLElement) {
	const { scrollLeft, scrollWidth, clientWidth } = el;
	return {
		left: scrollLeft > 0,
		right: scrollLeft + clientWidth < scrollWidth - 1,
	};
}

// 컨테이너 좌우 오버레이 요소 생성
function buildoverlays(
	overflow: { left: boolean; right: boolean },
	color: string,
	width: number,
): ReactNode {
	// 오버레이 스타일
	function style(side: "left" | "right"): CSSProperties {
		return {
			position: "absolute",
			top: 0,
			[side]: 0,
			height: "100%",
			width,
			pointerEvents: "none",
			background:
				side === "left"
					? `linear-gradient(to right, ${color}, transparent)`
					: `linear-gradient(to left, ${color}, transparent)`,
		};
	}

	return createElement(
		Fragment,
		null,
		overflow.left && createElement("div", { "aria-hidden": true, style: style("left") }),
		overflow.right && createElement("div", { "aria-hidden": true, style: style("right") }),
	);
}
