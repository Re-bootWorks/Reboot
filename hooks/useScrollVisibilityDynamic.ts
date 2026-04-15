"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

export type ScrollVisibilityDynamicState = {
	/** 스크롤 누적 방향 등으로 계산한 펼침 여부 */
	isVisible: boolean;
	/** `topOffset` px 초과 스크롤 여부 */
	hasPassedTopOffset: boolean;
};

type Options<T extends HTMLElement = HTMLElement> = {
	/** `scrollY`가 이보다 작으면 항상 펼침 */
	topOffset?: number;
	/** 아래 방향으로 해당 픽셀만큼 누적되면 접기 */
	collapsePx?: number;
	/** 위 방향으로 해당 픽셀만큼 누적되면 펼치기 */
	revealPx?: number;
	/** 접기/펼치기 직후 이 시간(ms) 동안 누적 갱신 안 함 */
	cooldownMs?: number;
	/** 프레임당 해당 값보다 작은 이동은 노이즈로 무시 */
	noisePx?: number;
	/** true면 스크롤로 접기/펼치기 판단 안 함 */
	suspend?: boolean;
	/** 스크롤 컨테이너 ref (생략 시 window) */
	targetRef?: React.RefObject<T | null>;
};

/** SSR, 클라이언트 첫 스냅샷 공용 (hydration mismatch 방지) */
const defaultServerSnapshot: ScrollVisibilityDynamicState = {
	isVisible: true,
	hasPassedTopOffset: false,
};

/** 가변 높이를 가진 요소를 sticky 처리하기 위한 훅 */
export default function useScrollVisibilityDynamic<T extends HTMLElement = HTMLElement>({
	topOffset = 88,
	collapsePx = 80,
	revealPx = 40,
	cooldownMs = 100,
	noisePx = 0.75,
	suspend = false,
	targetRef,
}: Options<T> = {}) {
	// 외부 저장소: 스냅샷 + 구독자
	const store = useRef({
		snapshot: defaultServerSnapshot,
		listeners: new Set<() => void>(),
	});

	// 프레임 간 유지되는 스크롤 계산용 값
	const lastY = useRef(0); // 직전 프레임의 스크롤 위치
	const acc = useRef(0); // 같은 방향 누적 이동량 (px)
	const lastFlipAt = useRef(0); // 마지막 접기/펼치기 시각 (ms)

	const emit = useCallback(() => {
		store.current.listeners.forEach((l) => l());
	}, []);

	// 값이 바뀔 때만 스냅샷 교체 후 알림 → 불필요한 리렌더 방지
	const publish = useCallback(
		(next: ScrollVisibilityDynamicState) => {
			const prev = store.current.snapshot;
			if (prev.isVisible === next.isVisible && prev.hasPassedTopOffset === next.hasPassedTopOffset)
				return;
			store.current.snapshot = next;
			emit();
		},
		[emit],
	);

	// useSyncExternalStore에 넘길 subscribe — React가 구독/해제 관리
	const subscribe = useCallback(
		(onStoreChange: () => void) => {
			const el = targetRef?.current;
			const root: Window | HTMLElement = el ?? window;
			const y = () => (el != null ? el.scrollTop : window.scrollY);

			// 구독 시점에 누적값 초기화
			lastY.current = y();
			acc.current = 0;
			lastFlipAt.current = 0;

			store.current.listeners.add(onStoreChange);

			let raf = 0;

			// 프레임마다 1회 실행되는 스크롤 판정 로직
			const flush = () => {
				raf = 0;
				const cur = y();
				const d = cur - lastY.current; // 이번 프레임의 이동량
				lastY.current = cur;

				const hasPassedTopOffset = cur > topOffset;
				let isVisible = store.current.snapshot.isVisible;

				if (suspend) {
					acc.current = 0;
					publish({ isVisible, hasPassedTopOffset });
					return;
				}

				// 페이지 최상단 근처일 때 무조건 펼침
				if (cur < topOffset) {
					acc.current = 0;
					isVisible = true;
					publish({ isVisible, hasPassedTopOffset });
					return;
				}

				const now = performance.now();

				// 상태 전환 직후 떨림 방지 (hasPassedTopOffset만 바뀔 수 있어 publish는 호출)
				if (now - lastFlipAt.current < cooldownMs) {
					publish({ isVisible, hasPassedTopOffset });
					return;
				}

				// 노이즈 필터: 터치 디바이스의 미세 진동 무시
				if (Math.abs(d) < noisePx) {
					publish({ isVisible, hasPassedTopOffset });
					return;
				}

				acc.current += d;

				if (isVisible) {
					// 역방향(위) 이동이 끼면 누적 리셋. 의도적 스크롤만 감지
					if (acc.current < 0) acc.current = 0;
					// 펼침 상태에서: 아래로 collapsePx 이상 누적되면 접기
					if (acc.current >= collapsePx) {
						acc.current = 0;
						lastFlipAt.current = now;
						isVisible = false;
					}
				} else {
					if (acc.current > 0) acc.current = 0;
					// 접힘 상태에서 위로 revealPx 이상 누적되면 펼치기
					if (acc.current <= -revealPx) {
						acc.current = 0;
						lastFlipAt.current = now;
						isVisible = true;
					}
				}

				publish({ isVisible, hasPassedTopOffset });
			};

			// throttle: 스크롤 이벤트가 많더라도 프레임당 1회만 flush
			const onScroll = () => {
				if (!raf) raf = requestAnimationFrame(flush);
			};

			root.addEventListener("scroll", onScroll, { passive: true });

			// 마운트 직후 현재 스크롤 위치 반영
			onScroll();

			return () => {
				if (raf) cancelAnimationFrame(raf);
				root.removeEventListener("scroll", onScroll);
				store.current.listeners.delete(onStoreChange);
			};
		},
		[topOffset, collapsePx, revealPx, cooldownMs, noisePx, suspend, targetRef, publish],
	);

	// getSnapshot: 클라이언트에서 현재 스냅샷
	const getSnapshot = useCallback(() => store.current.snapshot, []);
	// getServerSnapshot: SSR 시 고정값 (펼침, 미통과)
	const getServerSnapshot = useCallback(() => defaultServerSnapshot, []);

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
