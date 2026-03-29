"use client";
import PageTabs from "@/components/ui/PageTabs";
import Meetup from "../../Meetup";
import Review from "../../Review";
import Created from "../../Created";
import { Suspense, useEffect } from "react";
import DetailCardSkeleton from "../../components/DetailCard/DetailCardSkeleton";
import { useReplaceQueryParams } from "@/hooks/useReplaceQueryParams";

const TABS = ["meetup", "review", "created"] as const;
type TabId = (typeof TABS)[number];

// tab Query 검사 및 타입 가드
function isTabId(value: string | null): value is TabId {
	return value !== null && TABS.includes(value as TabId);
}

export default function TabWrapper() {
	const { get, set } = useReplaceQueryParams();
	const tabQuery = get("tab");
	const activeTab = isTabId(tabQuery) ? tabQuery : "meetup";

	// 잘못된 URL 수정
	useEffect(() => {
		if (tabQuery !== null && !isTabId(tabQuery)) {
			set({ tab: null });
		}
	}, [tabQuery, set]);

	const tabContents: Record<TabId, React.ReactNode> = {
		meetup: (
			<Suspense fallback={<DetailCardSkeleton />}>
				<Meetup />
			</Suspense>
		),
		review: <Review />,
		created: (
			<Suspense fallback={<DetailCardSkeleton />}>
				<Created />
			</Suspense>
		),
	};

	return (
		<div className="min-w-0 grow">
			<PageTabs defaultId={activeTab} onChange={({ id }) => set({ tab: id })}>
				<PageTabs.Item id="meetup">나의 모임</PageTabs.Item>
				<PageTabs.Item id="review">나의 리뷰</PageTabs.Item>
				<PageTabs.Item id="created">내가 만든 모임</PageTabs.Item>
			</PageTabs>

			{tabContents[activeTab]}
		</div>
	);
}
