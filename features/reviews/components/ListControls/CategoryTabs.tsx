"use client";

import TabButton from "@/components/ui/Buttons/TabButton";
import { useState } from "react";
import { TAB_OPTIONS } from "../../mockData";

export default function CategoryTabs() {
	const [activeTab, setActiveTab] = useState("전체");
	return (
		<div
			role="group"
			aria-label="모임 타입 필터"
			className="scrollbar-hide flex gap-2.5 overflow-x-auto">
			{TAB_OPTIONS.map((option) => (
				<TabButton
					key={option}
					selected={activeTab === option}
					onClick={() => {
						setActiveTab(option);
					}}>
					{option}
				</TabButton>
			))}
		</div>
	);
}
