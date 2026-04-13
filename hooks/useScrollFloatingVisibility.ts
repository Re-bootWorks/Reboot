"use client";

import { RefObject, useEffect, useState } from "react";

/**
 * 스크롤 방향과 기준 지점 통과 여부를 바탕으로
 * 플로팅 UI(모든 리뷰 페이지의 필터바)의 노출 여부를 제어하는 훅입니다.
 *
 * 동작 방식:
 * - 기준 지점(threshold 또는 triggerRef 위치) 이전에는 항상 노출됩니다.
 * - 기준 지점을 지난 뒤에는
 *   - 아래로 스크롤하면 숨김
 *   - 위로 스크롤하면 다시 노출
 * - 아주 미세한 스크롤 흔들림에 의해 노출 상태가 자주 바뀌지 않도록
 *   `delta` 값 이상 움직였을 때만 방향 전환을 반영합니다.
 *
 * 기준 지점을 판단하는 방법은 두 가지입니다.
 * 1. `triggerRef`가 있으면:
 *    해당 요소의 top 위치가 `offset` 이하로 올라왔는지로 판단합니다.
 * 2. `triggerRef`가 없으면:
 *    현재 스크롤 위치가 `threshold`를 넘었는지로 판단합니다.
 *
 * `targetRef`를 넘기면 window가 아니라 해당 스크롤 컨테이너의 scrollTop을 기준으로 동작합니다.
 *
 * @param threshold triggerRef가 없을 때 기준이 되는 스크롤 위치(px)
 * @param offset triggerRef가 있을 때 기준이 되는 top 오프셋(px)
 * @param delta 스크롤 방향 전환을 반영하기 위한 최소 이동 거리(px)
 * @param triggerRef 기준 지점 역할을 하는 요소 ref
 * @param targetRef window 대신 감시할 스크롤 컨테이너 ref
 *
 * @returns
 * - `isVisible`: 현재 플로팅 UI를 보여줄지 여부
 * - `hasPassedThreshold`: 기준 지점을 이미 지났는지 여부
 *
 * @example
 * // window 스크롤 기준으로 120px 이후부터
 * // 아래로 내리면 숨기고, 위로 올리면 다시 노출
 * const { isVisible, hasPassedThreshold } = useScrollFloatingVisibility({
 *   threshold: 120,
 * });
 *
 * @example
 * // 특정 요소가 화면 상단 0px에 닿은 뒤부터 동작
 * const triggerRef = useRef<HTMLDivElement>(null);
 *
 * const { isVisible } = useScrollFloatingVisibility({
 *   triggerRef,
 *   offset: 0,
 * });
 *
 * @example
 * // 특정 스크롤 컨테이너 내부에서 동작
 * const listRef = useRef<HTMLDivElement>(null);
 *
 * const { isVisible } = useScrollFloatingVisibility({
 *   threshold: 80,
 *   targetRef: listRef,
 * });
 */
interface UseScrollRevealProps {
	/** triggerRef가 없을 때 기준이 되는 스크롤 위치(px) */
	threshold?: number;
	/** triggerRef가 있을 때 top 비교에 사용하는 기준 오프셋(px) */
	offset?: number;
	/** 방향 전환으로 판단할 최소 스크롤 이동 거리(px) */
	delta?: number;
	/** 기준 지점 역할을 하는 요소 ref */
	triggerRef?: RefObject<HTMLElement | null>;
	/** window 대신 감시할 스크롤 컨테이너 ref */
	targetRef?: RefObject<HTMLElement | null>;
}

/**
 * 훅이 반환하는 상태값
 */
interface ScrollRevealState {
	/** 현재 플로팅 UI를 노출할지 여부 */
	isVisible: boolean;
	/** 기준 지점을 이미 통과했는지 여부 */
	hasPassedThreshold: boolean;
}

export default function useScrollFloatingVisibility({
	threshold = 0,
	offset = 0,
	delta = 8,
	triggerRef,
	targetRef,
}: UseScrollRevealProps = {}) {
	/**
	 * 훅의 최종 상태
	 *
	 * - isVisible:
	 *   플로팅 UI를 현재 보여줄지 여부
	 * - hasPassedThreshold:
	 *   기준 지점을 지났는지 여부
	 */
	const [state, setState] = useState<ScrollRevealState>({
		isVisible: true,
		hasPassedThreshold: false,
	});

	useEffect(() => {
		/** requestAnimationFrame 중복 예약 방지 플래그 */
		let ticking = false;

		/** 예약된 requestAnimationFrame id */
		let frameId: number | null = null;

		/** 직전 스크롤 위치 */
		let lastScroll = 0;

		/**
		 * 현재 스크롤 위치를 반환합니다.
		 *
		 * - targetRef가 있으면 해당 요소의 scrollTop
		 * - 없으면 window의 scrollY/pageYOffset
		 *
		 * @returns 현재 스크롤 위치(px)
		 */
		const getCurrentScroll = () => {
			if (targetRef?.current) {
				return targetRef.current.scrollTop;
			}

			return window.scrollY || window.pageYOffset;
		};

		/**
		 * 기준 지점을 통과했는지 계산합니다.
		 *
		 * - triggerRef가 있으면:
		 *   해당 요소의 top이 offset 이하인지로 판단
		 * - triggerRef가 없으면:
		 *   currentScroll이 threshold를 넘었는지로 판단
		 *
		 * @param currentScroll 현재 스크롤 위치(px)
		 * @returns 기준 지점 통과 여부
		 */
		const getHasPassedThreshold = (currentScroll: number) => {
			if (triggerRef?.current) {
				return triggerRef.current.getBoundingClientRect().top <= offset;
			}

			return currentScroll > threshold;
		};

		/**
		 * 실제 스크롤 상태를 계산하고 state를 갱신합니다.
		 *
		 * 계산 규칙:
		 * 1. 기준 지점을 지나지 않았으면 항상 보이게 함
		 * 2. 기준 지점을 지난 뒤
		 *    - 아래로 스크롤(scrollDiff > 0)하면 숨김
		 *    - 위로 스크롤(scrollDiff < 0)하면 노출
		 * 3. 단, delta 미만의 미세한 움직임은 무시하여
		 *    상태가 너무 자주 바뀌지 않도록 함
		 */
		const updateScroll = () => {
			const currentScroll = Math.max(getCurrentScroll(), 0);
			const scrollDiff = currentScroll - lastScroll;
			const hasPassedThreshold = getHasPassedThreshold(currentScroll);

			setState((prev) => {
				let isVisible = prev.isVisible;

				/**
				 * 아직 기준 지점을 지나지 않았거나
				 * threshold 이하의 초기 구간이면 항상 노출
				 */
				if (!hasPassedThreshold || currentScroll <= threshold) {
					isVisible = true;
				} else if (!prev.hasPassedThreshold) {
					/**
					 * 이번 프레임에서 처음 기준 지점을 지난 경우
					 * 방향에 따라 바로 노출 여부 결정
					 */
					isVisible = scrollDiff < 0;
				} else if (Math.abs(scrollDiff) >= delta) {
					/**
					 * 이미 기준 지점을 지난 상태에서는
					 * delta 이상 움직였을 때만 방향 전환 반영
					 */
					isVisible = scrollDiff < 0;
				}

				/**
				 * 값이 완전히 같으면 이전 객체를 그대로 반환해서
				 * 불필요한 리렌더를 방지
				 */
				if (prev.isVisible === isVisible && prev.hasPassedThreshold === hasPassedThreshold) {
					return prev;
				}

				return { isVisible, hasPassedThreshold };
			});

			lastScroll = currentScroll;
			ticking = false;
			frameId = null;
		};

		/**
		 * scroll 이벤트 핸들러
		 *
		 * 스크롤 이벤트가 매우 자주 발생하므로
		 * requestAnimationFrame으로 한 프레임당 한 번만 계산하도록 제한합니다.
		 */
		function handleScroll() {
			if (!ticking) {
				frameId = requestAnimationFrame(updateScroll);
				ticking = true;
			}
		}

		/** 이 effect가 시작될 때 현재 스크롤 위치를 초기값으로 저장 */
		lastScroll = Math.max(getCurrentScroll(), 0);

		/** 실제 스크롤 이벤트를 바인딩할 대상 */
		const scrollTarget = targetRef?.current;

		if (scrollTarget) {
			scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
		} else {
			window.addEventListener("scroll", handleScroll, { passive: true });
		}

		/**
		 * resize 시에도 triggerRef의 위치나 레이아웃이 바뀔 수 있으므로
		 * 다시 계산하도록 등록
		 */
		window.addEventListener("resize", handleScroll);

		/** 마운트 직후 현재 상태를 한 번 즉시 계산 */
		handleScroll();

		return () => {
			if (frameId !== null) {
				cancelAnimationFrame(frameId);
			}

			if (scrollTarget) {
				scrollTarget.removeEventListener("scroll", handleScroll);
			} else {
				window.removeEventListener("scroll", handleScroll);
			}

			window.removeEventListener("resize", handleScroll);
		};
	}, [delta, offset, targetRef, threshold, triggerRef]);

	return state;
}
