"use client";
import { useEffect, useRef } from "react";
import PageTabs from "@/components/ui/PageTabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import ReviewWrapper from "../../Review";
import MeetupWrapper from "../../Meetup";
import CreatedWrapper from "../../Created";
import { useIsLg } from "@/hooks/useIsLg";

const TABS = ["meetup", "review", "created"] as const;
type TabId = (typeof TABS)[number];

// tab Query 검사 및 타입 가드
function isTabId(value: string | null): value is TabId {
	return value !== null && TABS.includes(value as TabId);
}

// 탭 이동시 스크롤 초기화

export default function TabWrapper() {
	const { get, set } = useQueryParams();
	const tabQuery = get("tab");
	const activeTab = isTabId(tabQuery) ? tabQuery : "meetup";
	const isLg = useIsLg();
	const contentRef = useRef<HTMLDivElement>(null);

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
			<div className="sticky top-12 z-10 bg-gray-50 md:top-22 lg:static">
				<PageTabs defaultId={activeTab} onChange={({ id }) => set({ tab: id })}>
					<PageTabs.Item id="meetup">나의 모임</PageTabs.Item>
					<PageTabs.Item id="review">나의 리뷰</PageTabs.Item>
					<PageTabs.Item id="created">내가 만든 모임</PageTabs.Item>
				</PageTabs>
			</div>

			<div ref={contentRef} className="scrollbar mt-6 lg:mt-8 lg:max-h-[calc(100vh-278px)]">
				{tabContents[activeTab]}
			</div>
		</div>
	);
}
