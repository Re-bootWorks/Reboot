"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { IcChevronDown } from "@/components/ui/icons";

type ReviewCommentProps = {
	comment: string;
};

export default function ReviewComment({ comment }: ReviewCommentProps) {
	/** 실제 댓글 텍스트 DOM을 잡기 위한 ref */
	const textRef = useRef<HTMLParagraphElement>(null);

	/** 현재 댓글을 펼친 상태인지 여부 */
	const [isExpanded, setIsExpanded] = useState(false);

	/** 댓글이 2줄을 초과해서 더보기 버튼이 필요한지 여부 */
	const [isOverflow, setIsOverflow] = useState(false);

	useEffect(() => {
		/** 실제 렌더된 p 태그 요소 */
		const element = textRef.current;
		if (!element) return;

		/**
		 * 댓글이 2줄을 넘는지 검사하는 함수
		 *
		 * 방식:
		 * 1. 현재 p 태그의 실제 스타일 정보를 읽어온다
		 * 2. 같은 스타일/같은 너비를 가진 숨김 측정용 요소를 만든다
		 * 3. 그 요소의 전체 높이를 잰다
		 * 4. 한 줄 높이 * 2 보다 크면 2줄 초과로 판단한다
		 */
		const checkOverflow = () => {
			/** 현재 화면에 보이는 p 태그의 계산된 최종 스타일 */
			const computedStyle = window.getComputedStyle(element);

			/** line-height 값 파싱 */
			const lineHeight = Number.parseFloat(computedStyle.lineHeight);

			/** font-size 값 파싱 */
			const fontSize = Number.parseFloat(computedStyle.fontSize);

			/**
			 * line-height가 normal 등으로 들어와 숫자 파싱이 안 될 수도 있어서
			 * 그 경우 font-size * 1.5 를 임시 line-height로 사용
			 */
			const resolvedLineHeight = Number.isNaN(lineHeight) ? fontSize * 1.5 : lineHeight;

			/** 실제 화면에는 보이지 않는 측정용 p 태그 생성 */
			const measureElement = document.createElement("p");

			/** 원본 댓글 텍스트를 그대로 넣음 */
			measureElement.textContent = comment;

			/** 화면에 보이지 않게 절대 위치로 둠 */
			measureElement.style.position = "absolute";

			/** 보이지 않게 숨김 */
			measureElement.style.visibility = "hidden";

			/** 클릭 등 이벤트 방지 */
			measureElement.style.pointerEvents = "none";

			/** 화면 뒤로 보냄 */
			measureElement.style.zIndex = "-1";

			/** 원본과 같은 줄바꿈 처리 유지 */
			measureElement.style.whiteSpace = "pre-line";

			/** 단어 줄바꿈 규칙도 원본과 맞춤 */
			measureElement.style.wordBreak = computedStyle.wordBreak;

			/** 긴 단어 줄바꿈 규칙도 원본과 맞춤 */
			measureElement.style.overflowWrap = computedStyle.overflowWrap;

			/** 폰트 관련 스타일을 원본과 동일하게 맞춤 */
			measureElement.style.font = computedStyle.font;

			/** 자간(글자와 글자 사이 간격)도 원본과 동일하게 맞춤 */
			measureElement.style.letterSpacing = computedStyle.letterSpacing;

			/** 현재 실제 댓글 박스 너비와 동일하게 맞춤 */
			measureElement.style.width = `${element.clientWidth}px`;

			/** 패딩도 동일하게 맞춤 */
			measureElement.style.padding = computedStyle.padding;

			/** border도 동일하게 맞춤 */
			measureElement.style.border = computedStyle.border;

			/** box-sizing도 동일하게 맞춤 */
			measureElement.style.boxSizing = computedStyle.boxSizing;

			/** 측정하려면 DOM에 붙어 있어야 해서 body에 잠깐 추가 */
			document.body.appendChild(measureElement);

			/** 전체 텍스트 높이 측정 */
			const fullHeight = measureElement.getBoundingClientRect().height;

			/** 측정 끝났으니 바로 제거 */
			document.body.removeChild(measureElement);

			/**
			 * 전체 높이가 2줄 높이보다 크면
			 * -> 2줄을 넘는 댓글
			 * -> 더보기 버튼 필요
			 *
			 * +1은 소수점/브라우저 렌더링 오차 보정용
			 */
			setIsOverflow(fullHeight > resolvedLineHeight * 2 + 1);
		};

		/** 최초 1회 overflow 여부 검사 */
		checkOverflow();

		/**
		 * 요소 크기 변화 감지
		 *
		 * 예:
		 * - 브라우저 너비 변경
		 * - 반응형 적용
		 * - 부모 너비 변경
		 *
		 * 이런 경우 줄 수가 달라질 수 있어서 다시 검사
		 */
		const observer = new ResizeObserver(() => {
			checkOverflow();
		});

		/** 현재 댓글 요소의 크기 변화를 감시 시작 */
		observer.observe(element);

		/** 컴포넌트 사라질 때 observer 정리 */
		return () => {
			observer.disconnect();
		};
	}, [comment]);

	return (
		<div className="flex flex-col items-start gap-2">
			<p
				ref={textRef}
				className={cn(
					"text-sm whitespace-pre-line text-gray-700 md:text-lg",
					/** 펼치지 않은 상태일 때만 2줄 말줄임 적용 */
					!isExpanded && "line-clamp-2",
				)}>
				{comment}
			</p>

			{isOverflow && (
				<button
					type="button"
					/** 버튼 클릭 시 펼침/접힘 상태 토글 */
					onClick={() => setIsExpanded((prev) => !prev)}
					className="flex cursor-pointer items-center gap-0.5 text-sm font-medium text-gray-700 underline underline-offset-3 md:mb-2 md:text-lg">
					{/** 상태에 따라 버튼 문구 변경 */}
					{isExpanded ? "접기" : "더보기"}

					<IcChevronDown
						color="gray-700"
						/** 펼친 상태면 화살표 180도 회전 */
						className={cn(isExpanded && "rotate-180")}
					/>
				</button>
			)}
		</div>
	);
}
