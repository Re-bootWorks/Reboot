"use client";
import { useState } from "react";
import PageTabs from "@/components/ui/PageTabs";
import { TabId } from "@/features/mypage/types";
import Meetup from "../Meetup";
import Review from "../Review";
import Created from "../Created";

export default function TabWrapper() {
	const [activeTab, setActiveTab] = useState<TabId>("meetup");

	const tabContents: Record<TabId, React.ReactNode> = {
		meetup: <Meetup />,
		review: <Review />,
		created: <Created />,
	};

	return (
		<div className="min-w-0 grow">
			<PageTabs defaultId={"meetup"} onChange={({ id }) => setActiveTab(id as TabId)}>
				<PageTabs.Item id="meetup">나의 모임</PageTabs.Item>
				<PageTabs.Item id="review">나의 리뷰</PageTabs.Item>
				<PageTabs.Item id="created">내가 만든 모임</PageTabs.Item>
			</PageTabs>

			{tabContents[activeTab]}
		</div>
	);
}
