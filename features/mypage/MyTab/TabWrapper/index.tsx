"use client";
import { useEffect, useRef } from "react";
import PageTabs from "@/components/ui/PageTabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import ReviewWrapper from "../../Review";
import MeetupWrapper from "../../Meetup";
import CreatedWrapper from "../../Created";
import ScrollTopButton from "@/components/ui/Buttons/ScrollTopButton";
import useScrollVisibility from "@/hooks/useScrollVisibility";
import { cn } from "@/utils/cn";
import useMediaQuery from "@/hooks/useMediaQuery";

const MEDIA_QUERY_LG = "(min-width:1280px)";
const MEDIA_QUERY_MD = "(min-width:744px)";
const THRESHOLD = {
	lg: 20,
	md: 320,
	sm: 220,
} as const;

const TABS = ["meetup", "review", "created"] as const;
type TabId = (typeof TABS)[number];

const STYLE = {
	tabWrapper: "sticky top-12 z-10 bg-gray-50 md:top-22 lg:static",
	scroll:
		"h-4 shadow-[0_13px_12px_rgba(0,0,0,0.08)] overflow-hidden absolute bottom-px left-0 z-0 block w-full",
};

// tab Query 검사 및 타입 가드
function isTabId(value: string | null): value is TabId {
	return value !== null && TABS.includes(value as TabId);
}

export default function TabWrapper() {
	const { get, set } = useQueryParams();
	const tabQuery = get("tab");
	const activeTab = isTabId(tabQuery) ? tabQuery : "meetup";
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
		meetup: <MeetupWrapper />,
		review: <ReviewWrapper />,
		created: <CreatedWrapper />,
	};

	// activeTab 변경시 스크롤 초기화
	useEffect(() => {
		if (isLg) {
			contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
		} else {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [activeTab, isLg]);

	return (
		<div className="min-w-0 grow">
			<div className={STYLE.tabWrapper}>
				<div className={cn("relative z-1")}>
					<div className={isVisible ? STYLE.scroll : ""} />
					<PageTabs defaultId={activeTab} onChange={({ id }) => set({ tab: id })}>
						<PageTabs.Item id="meetup">나의 모임</PageTabs.Item>
						<PageTabs.Item id="review">나의 리뷰</PageTabs.Item>
						<PageTabs.Item id="created">내가 만든 모임</PageTabs.Item>
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
