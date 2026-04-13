"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

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

export default function useScrollSticky<T extends HTMLElement = HTMLElement>({
	topOffset = 88,
	collapsePx = 32,
	revealPx = 20,
	cooldownMs = 100,
	noisePx = 0.75,
	suspend = false,
	targetRef,
}: Options<T> = {}) {
	// 외부 저장소
	const store = useRef({
		expanded: true,
		listeners: new Set<() => void>(),
	});

	// 프레임 간 유지되는 스크롤 계산용 값
	const lastY = useRef(0); // 직전 프레임의 스크롤 위치
	const acc = useRef(0); // 같은 방향 누적 이동량 (px)
	const lastFlipAt = useRef(0); // 마지막 접기/펼치기 시각 (ms)

	const emit = useCallback(() => {
		store.current.listeners.forEach((l) => l());
	}, []);

	// expanded가 실제로 바뀔 때만 구독자에게 알림 → 불필요한 리렌더 방지
	const setExpanded = useCallback(
		(next: boolean) => {
			if (store.current.expanded === next) return;
			store.current.expanded = next;
			emit();
		},
		[emit],
	);

	// useSyncExternalStore에 넘길 subscribe 함수
	// React가 이 함수를 호출해 구독하고, 반환된 cleanup으로 해제
	// useEffect 없이도 스크롤 리스너 생명주기가 자동 관리
	const subscribe = useCallback(
		(onStoreChange: () => void) => {
			const el = targetRef?.current;
			const root: Window | HTMLElement = el ?? window;
			const y = () => (el != null ? el.scrollTop : window.scrollY);

			// 구독 시점에 누적값 초기화
			lastY.current = y();
			acc.current = 0;
			lastFlipAt.current = 0;

			// React가 넘겨준 콜백을 구독자 목록에 등록
			store.current.listeners.add(onStoreChange);

			let raf = 0;

			// 프레임마다 1회 실행되는 스크롤 판정 로직
			const flush = () => {
				raf = 0;
				const cur = y();
				const d = cur - lastY.current; // 이번 프레임의 이동량
				lastY.current = cur;

				if (suspend) {
					acc.current = 0;
					return;
				}

				// 페이지 최상단 근처일 때 무조건 펼침
				if (cur < topOffset) {
					acc.current = 0;
					setExpanded(true);
					return;
				}

				const now = performance.now();

				// 상태 전환 직후 떨림 방지
				if (now - lastFlipAt.current < cooldownMs) return;

				// 노이즈 필터: 터치 디바이스의 미세 진동 무시
				if (Math.abs(d) < noisePx) return;

				acc.current += d;

				// 펼침 상태에서: 아래로 collapsePx 이상 누적되면 접기
				if (store.current.expanded) {
					// 역방향(위) 이동이 끼면 누적 리셋. 의도적 스크롤만 감지
					if (acc.current < 0) acc.current = 0;
					if (acc.current >= collapsePx) {
						acc.current = 0;
						lastFlipAt.current = now;
						setExpanded(false);
					}
				}
				// 접힘 상태에서 위로 revealPx 이상 누적되면 펼치기
				else {
					if (acc.current > 0) acc.current = 0;
					if (acc.current <= -revealPx) {
						acc.current = 0;
						lastFlipAt.current = now;
						setExpanded(true);
					}
				}
			};

			// throttle: 스크롤 이벤트가 많더라도 프레임당 1회만 flush
			const onScroll = () => {
				if (!raf) raf = requestAnimationFrame(flush);
			};

			root.addEventListener("scroll", onScroll, { passive: true });

			return () => {
				if (raf) cancelAnimationFrame(raf);
				root.removeEventListener("scroll", onScroll);
				store.current.listeners.delete(onStoreChange);
			};
		},
		[topOffset, collapsePx, revealPx, cooldownMs, noisePx, suspend, targetRef, setExpanded],
	);

	// getSnapshot: React가 현재 값을 읽을 때 호출
	// 세 번째 인자(서버 스냅샷)도 같은 함수. SSR에서도 true(펼침)로 시작
	const getSnapshot = useCallback(() => store.current.expanded, []);

	return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
