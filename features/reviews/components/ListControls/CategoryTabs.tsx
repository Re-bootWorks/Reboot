"use client";

import TabButton from "@/components/ui/Buttons/TabButton";
import { useCategoryStore } from "@/store/category.store";
import useDragScroll, { containerStyle } from "@/hooks/useDragScroll";
import { useQueryParams } from "@/hooks/useQueryParams";
import { QUERY_KEYS } from "@/features/meetup/list/constants";
import { cn } from "@/utils/cn";

export default function CategoryTabs() {
	const { ref, overlays, ...events } = useDragScroll<HTMLUListElement>();
	const { get, set } = useQueryParams();
	const { categories } = useCategoryStore();

	const type = get(QUERY_KEYS.TYPE) ?? categories[0].name;

	function handleChangeType(v: string) {
		set({ [QUERY_KEYS.TYPE]: v });
	}

	return (
		<div role="group" aria-label="모임 타입 필터" className="relative">
			<ul ref={ref} className={cn(containerStyle, "flex gap-x-2.5")} {...events}>
				{categories.map((i) => (
					<li key={i.name} className="whitespace-nowrap">
						<TabButton selected={type === i.name} onClick={() => handleChangeType(i.name)}>
							{i.name}
						</TabButton>
					</li>
				))}
			</ul>
			{overlays}
		</div>
	);
}
