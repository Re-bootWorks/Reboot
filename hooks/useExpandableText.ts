"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

type UseExpandableTextOptions = {
	content: string;
};

export function useExpandableText<T extends HTMLElement>({ content }: UseExpandableTextOptions) {
	/** 실제 텍스트가 렌더되는 DOM 요소를 가리키는 ref */
	const contentRef = useRef<T>(null);

	/** 사용자가 "더보기"를 눌러 전체 텍스트를 펼친 상태인지 여부 */
	const [isExpanded, setIsExpanded] = useState(false);

	/** 텍스트가 접힌 상태에서 실제로 잘리는지 여부 */
	const [isOverflow, setIsOverflow] = useState(false);

	useLayoutEffect(() => {
		const element = contentRef.current;
		if (!element) return;

		const checkOverflow = () => {
			if (!contentRef.current) return;

			/**
			 * scrollHeight: 내용 전체 높이
			 * clientHeight: 현재 화면에 실제로 보이는 높이
			 * line-clamp 적용 시 텍스트가 잘리고 있음
			 * 접힌 상태(line-clamp 적용)에서
			 * +1은 브라우저 소수점 반올림 오차를 보정하기 위한 여유값
			 */
			setIsOverflow(contentRef.current.scrollHeight > contentRef.current.clientHeight + 1);
		};

		checkOverflow();

		const observer = new ResizeObserver(() => {
			if (!isExpanded) {
				checkOverflow();
			}
		});

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [content, isExpanded]);

	const toggleExpanded = useCallback(() => {
		setIsExpanded((prev) => !prev);
	}, []);

	return {
		contentRef,
		isExpanded,
		isOverflow,
		toggleExpanded,
	};
}
