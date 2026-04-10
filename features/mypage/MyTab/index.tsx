"use client";

import dynamic from "next/dynamic";
import TabSkeleton from "./TabWrapper/TabSkeleton";
import DetailCardSkeleton from "../components/DetailCard/DetailCardSkeleton";

const TabWrapper = dynamic(() => import("./TabWrapper"), {
	ssr: false,
	loading: () => (
		<div className="min-w-0 grow">
			<TabSkeleton />
			<DetailCardSkeleton />
		</div>
	),
});

export default function MyTab() {
	return <TabWrapper />;
}
