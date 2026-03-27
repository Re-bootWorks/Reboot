import { useEffect } from "react";

/**
 * 무한 스크롤 시 뷰포트 감지하여 콜백을 실행하는 hook
 *
 * @example
 * const content = useRef<HTMLDivElement>(null);
 *
 * useIntersectionObserver({
 *   targetRef: content,
 *   onIntersect: fetchNextPage,
 *   isEnabled: hasNextPage && !isFetchingNextPage,
 * });
 *
 * return <div ref={content} />;
 */

interface UseIntersectionObserverProps {
	/** 감시할 DOM 요소의 ref */
	targetRef: React.RefObject<Element | null>;
	/** 요소가 화면에 보였을 때 실행할 함수 */
	onIntersect: () => void;
	/** 옵저버 활성화 여부 */
	isEnabled: boolean;
}

export function useIntersectionObserver({
	targetRef,
	onIntersect,
	isEnabled,
}: UseIntersectionObserverProps) {
	useEffect(() => {
		if (!isEnabled) return; // 비활성화면 감시 자체를 안 함

		// 특정 요소가 뷰포트에 들어오는지 감시하는 객체
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					onIntersect(); // 요소가 화면에 보이고 있는지 확인
				}
			},
			{ threshold: 0.1 }, // 요소가 10% 이상 화면에 보일 때 감지
		);

		if (targetRef.current) observer.observe(targetRef.current);

		return () => observer.disconnect();
	}, [targetRef, onIntersect, isEnabled]);
}
