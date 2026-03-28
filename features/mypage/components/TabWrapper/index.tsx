"use client";
import PageTabs from "@/components/ui/PageTabs";
import { TabId } from "@/features/mypage/types";
import Meetup from "../Meetup";
import Review from "../Review";
import Created from "../Created";
import { useQueryParams } from "@/hooks/useQueryParams";

export default function TabWrapper() {
	const { get, set } = useQueryParams();
	const activeTab = (get("tab") as TabId) ?? "meetup";

	const tabContents: Record<TabId, React.ReactNode> = {
		meetup: <Meetup />,
		review: <Review />,
		created: <Created />,
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
