"use client";
import { useEffect, useRef, useState } from "react";
import PageTabs from "@/components/ui/PageTabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import JoinedMeetingListWrapper from "../../JoinedMeetingList";
import CreatedMeetingListWrapper from "../../CreatedMeetingList";
import ScrollTopButton from "@/components/ui/Buttons/ScrollTopButton";
import useScrollVisibility from "@/hooks/useScrollVisibility";
import { cn } from "@/utils/cn";
import useMediaQuery from "@/hooks/useMediaQuery";
import AvailableReviewListWrapper from "../../AvailableReviewList";
import WrittenReviewListWrapper from "../../WrittenReviewList";

const MEDIA_QUERY_LG = "(min-width:1280px)";
const MEDIA_QUERY_MD = "(min-width:744px)";
const TAB_STICKY_OFFSET = {
	sm: 48,
	md: 88,
} as const;
// STICKY 이후 스크롤 시 스타일 적용 임계값
const THRESHOLD = {
	lg: 20,
	md: 320,
	sm: 220,
} as const;

const STYLE = {
	tabWrapper: "sticky top-12 z-10 bg-gray-50 md:top-22 lg:static",
	scroll:
		"h-4 shadow-[0_13px_16px_rgba(0,0,0,0.08)] overflow-hidden absolute bottom-px left-0 z-0 block w-full",
};

const TAB_ITEMS = [
	{ id: "JoinedMeetingList", label: "참여 모임" },
	{ id: "CreatedMeetingList", label: "개설 모임" },
	{ id: "AvailableReviewList", label: "리뷰 작성" },
	{ id: "WrittenReviewList", label: "리뷰 목록" },
] as const;
type TabId = (typeof TAB_ITEMS)[number]["id"];

// tab Query 검사 및 타입 가드
function isTabId(value: string | null): value is TabId {
	return value !== null && TAB_ITEMS.some((tabItem) => tabItem.id === value);
}

export default function TabWrapper() {
	const { get, set } = useQueryParams();
	const tabQuery = get("tab");
	const activeTab = isTabId(tabQuery) ? tabQuery : TAB_ITEMS[0].id;
	const isLg = useMediaQuery(MEDIA_QUERY_LG);
	const isMd = useMediaQuery(MEDIA_QUERY_MD);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const tabRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const threshold = isLg ? THRESHOLD.lg : isMd ? THRESHOLD.md : THRESHOLD.sm;

	const isVisible = useScrollVisibility({
		threshold,
		targetRef: isLg ? contentRef : undefined,
	});

	// 잘못된 URL 수정
	useEffect(() => {
		if (tabQuery !== null && !isTabId(tabQuery)) {
			set({ tab: null });
		}
	}, [tabQuery, set]);

	const tabContents: Record<TabId, React.ReactNode> = {
		JoinedMeetingList: <JoinedMeetingListWrapper onDropdownOpenChange={setIsDropdownOpen} />,
		CreatedMeetingList: <CreatedMeetingListWrapper onDropdownOpenChange={setIsDropdownOpen} />,
		AvailableReviewList: <AvailableReviewListWrapper />,
		WrittenReviewList: <WrittenReviewListWrapper onDropdownOpenChange={setIsDropdownOpen} />,
	};

	// activeTab 변경시 스크롤 초기화
	useEffect(() => {
		// @TODO preview 확인 후 삭제
		console.log("마이페이지 스크롤 이벤트 시작", {
			activeTab,
			isLg,
			isMd,
			scrollY: window.scrollY,
			tabTop: tabRef.current?.getBoundingClientRect().top,
			threshold,
		});
		setIsDropdownOpen(false);

		if (isLg) {
			contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
			return;
		}
		const stickyOffset = isMd ? TAB_STICKY_OFFSET.md : TAB_STICKY_OFFSET.sm;
		const tabTop = tabRef.current?.getBoundingClientRect().top;

		// 탭 영역이 sticky 기준보다 위로 올라가 있거나 정확히 붙은 상태일때만 이동
		if (tabTop !== undefined && tabTop <= stickyOffset) {
			const nextTop = threshold - 20;
			window.scrollTo({ top: Math.max(nextTop, 0), behavior: "smooth" });
		}
	}, [activeTab]);

	// @TODO preview 확인 후 삭제
	useEffect(() => {
		console.log("마이페이지 탭 변경", {
			tabQuery,
			activeTab,
		});
	}, [tabQuery, activeTab]);
	return (
		<div className="min-w-0 grow">
			<div className={STYLE.tabWrapper} ref={tabRef}>
				<div className={cn("relative z-1")}>
					<div className={isVisible ? STYLE.scroll : ""} />
					<PageTabs
						defaultId={activeTab}
						onChange={({ id }) => {
							// @TODO preview 확인 후 삭제
							console.log("마이페이지 탭 변경", {
								id,
								beforeTabQuery: tabQuery,
								isLg,
								isMd,
								scrollY: window.scrollY,
							});
							set({ tab: id });
						}}>
						{TAB_ITEMS.map((tabItem) => (
							<PageTabs.Item
								key={tabItem.id}
								id={tabItem.id}
								className="sm:grow md:grow-0"
								btnClassName="min-w-auto w-full">
								{tabItem.label}
							</PageTabs.Item>
						))}
					</PageTabs>
				</div>
			</div>

			<div
				ref={contentRef}
				className={cn(
					"scrollbar pt-6 lg:max-h-[calc(100vh-214px)] lg:overflow-y-auto",
					isLg && isDropdownOpen && "lg:overflow-hidden!",
				)}>
				{tabContents[activeTab]}
			</div>
			<ScrollTopButton
				targetRef={contentRef}
				className={isLg ? "absolute min-[1400px]:-right-8" : ""}
			/>
		</div>
	);
}
