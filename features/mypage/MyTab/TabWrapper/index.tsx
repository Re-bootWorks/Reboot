"use client";
import { useEffect, useRef } from "react";
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
const DEFAULT_TAB = "JoinedMeetingList";
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

const TABS = [
	"JoinedMeetingList",
	"CreatedMeetingList",
	"AvailableReviewList",
	"WrittenReviewList",
] as const;
type TabId = (typeof TABS)[number];

// tab Query 검사 및 타입 가드
function isTabId(value: string | null): value is TabId {
	return value !== null && TABS.includes(value as TabId);
}

export default function TabWrapper() {
	const { get, set } = useQueryParams();
	const tabQuery = get("tab");
	const activeTab = isTabId(tabQuery) ? tabQuery : DEFAULT_TAB;
	const isLg = useMediaQuery(MEDIA_QUERY_LG);
	const isMd = useMediaQuery(MEDIA_QUERY_MD);
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
		JoinedMeetingList: <JoinedMeetingListWrapper />,
		CreatedMeetingList: <CreatedMeetingListWrapper />,
		AvailableReviewList: <AvailableReviewListWrapper />,
		WrittenReviewList: <WrittenReviewListWrapper />,
	};

	// activeTab 변경시 스크롤 초기화
	useEffect(() => {
		if (isLg) {
			contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
		} else {
			window.scrollTo({ top: isMd ? THRESHOLD.md - 20 : THRESHOLD.sm - 20, behavior: "smooth" });
		}
	}, [activeTab]);

	return (
		<div className="min-w-0 grow">
			<div className={STYLE.tabWrapper}>
				<div className={cn("relative z-1")}>
					<div className={isVisible ? STYLE.scroll : ""} />
					<PageTabs
						defaultId={activeTab}
						onChange={({ id }) => {
							set({ tab: id });
						}}>
						<PageTabs.Item
							id="JoinedMeetingList"
							className="sm:grow md:grow-0"
							btnClassName="min-w-auto w-full">
							참여한 모임
						</PageTabs.Item>
						<PageTabs.Item
							id="CreatedMeetingList"
							className="sm:grow md:grow-0"
							btnClassName="min-w-auto w-full">
							만든 모임
						</PageTabs.Item>
						<PageTabs.Item
							id="AvailableReviewList"
							className="sm:grow md:grow-0"
							btnClassName="min-w-auto w-full">
							리뷰 작성
						</PageTabs.Item>
						<PageTabs.Item
							id="WrittenReviewList"
							className="sm:grow md:grow-0"
							btnClassName="min-w-auto w-full">
							리뷰 목록
						</PageTabs.Item>
					</PageTabs>
				</div>
			</div>

			<div ref={contentRef} className="scrollbar pt-6 lg:max-h-[calc(100vh-214px)]">
				{tabContents[activeTab]}
			</div>
			<ScrollTopButton
				targetRef={contentRef}
				className={isLg ? "absolute min-[1400px]:-right-8" : ""}
			/>
		</div>
	);
}
