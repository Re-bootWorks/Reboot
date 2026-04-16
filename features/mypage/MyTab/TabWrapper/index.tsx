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
	const isLg = useMediaQuery(MEDIA_QUERY_LG);
	const isMd = useMediaQuery(MEDIA_QUERY_MD);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<TabId>(isTabId(tabQuery) ? tabQuery : TAB_ITEMS[0].id);
	const tabAnchorRef = useRef<HTMLDivElement>(null);
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

	// URL query 변경 시 local activeTab 동기화
	useEffect(() => {
		const nextTab = isTabId(tabQuery) ? tabQuery : TAB_ITEMS[0].id;
		if (nextTab !== activeTab) {
			setActiveTab(nextTab);
		}
	}, [tabQuery, activeTab]);

	const tabContents: Record<TabId, React.ReactNode> = {
		JoinedMeetingList: <JoinedMeetingListWrapper onDropdownOpenChange={setIsDropdownOpen} />,
		CreatedMeetingList: <CreatedMeetingListWrapper onDropdownOpenChange={setIsDropdownOpen} />,
		AvailableReviewList: <AvailableReviewListWrapper />,
		WrittenReviewList: <WrittenReviewListWrapper onDropdownOpenChange={setIsDropdownOpen} />,
	};

	function scrollToTabContentTop() {
		if (isLg) {
			contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
			return;
		}

		const stickyOffset = isMd ? TAB_STICKY_OFFSET.md : TAB_STICKY_OFFSET.sm;
		const anchorTop =
			(tabAnchorRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - stickyOffset;

		window.scrollTo({
			top: Math.max(anchorTop, 0),
			behavior: "smooth",
		});
	}
	return (
		<div className="min-w-0 grow">
			<div ref={tabAnchorRef} />
			<div className={STYLE.tabWrapper} ref={tabRef}>
				<div className={cn("relative z-1")}>
					<div className={isVisible ? STYLE.scroll : ""} />
					<PageTabs
						key={activeTab}
						defaultId={activeTab}
						onChange={({ id }) => {
							const nextTab = id as TabId;
							setIsDropdownOpen(false);
							scrollToTabContentTop();
							setActiveTab(nextTab);
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
					isLg && isDropdownOpen && "lg:overflow-hidden! lg:pr-2.75",
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
