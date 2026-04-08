"use client";

import { RefObject, useEffect, useState } from "react";

/**
 * 스크롤 위치에 따라 요소 노출 여부를 제어
 * 기본적으로는 window 스크롤을 기준으로 동작하고
 * targetRef를 넘기면 해당 스크롤 컨테이너의 scrollTop을 기준으로 동작합니다.
 *
 * @param threshold 스크롤이 이 값(px)을 넘으면 true 반환
 * @param targetRef window 대신 감시할 스크롤 컨테이너 ref
 *
 * @example
 * const isVisible = useScrollVisibility({ threshold: 200 });
 * const isVisible = useScrollVisibility({
 *   threshold: 200,
 *   targetRef: contentRef,
 * });
 */

interface UseScrollVisibilityProps {
	threshold?: number;
	targetRef?: RefObject<HTMLElement | null>;
}

export default function useScrollVisibility({
	threshold = 100,
	targetRef,
}: UseScrollVisibilityProps = {}) {
	// 현재 기준 스크롤 위치가 threshold를 넘었는지 여부
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		let ticking = false;
		let frameId: number | null = null;

		const updateScroll = () => {
			// targetRef가 있으면 내부 컨테이너 scrollTop 사용, 없으면 window 스크롤 위치를 사용
			const currentScroll = targetRef?.current
				? targetRef.current.scrollTop
				: window.scrollY || window.pageYOffset;
			const shouldBeVisible = currentScroll > threshold;

			// 동일한 값으로 변경하지 않도록 이전 값 비교후 갱신
			setIsVisible((prev) => (prev !== shouldBeVisible ? shouldBeVisible : prev));
			ticking = false;
			frameId = null;
		};

		// requestAnimationFrame으로 한 프레임에 한 번만 상태를 갱신하도록 제한
		function handleScroll() {
			if (!ticking) {
				requestAnimationFrame(updateScroll);
				ticking = true;
			}
		}

		// 실제로 스크롤되는 대상
		const scrollTarget = targetRef?.current;

		if (scrollTarget) {
			scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
		} else {
			window.addEventListener("scroll", handleScroll, { passive: true });
		}

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
		};
	}, [threshold, targetRef]);

	return isVisible;
}
