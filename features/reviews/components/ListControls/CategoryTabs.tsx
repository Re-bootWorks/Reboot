"use client";

import TabButton from "@/components/ui/Buttons/TabButton";
import { useCategoryStore } from "@/store/category.store";
import useDragScroll, { containerStyle } from "@/hooks/useDragScroll";
import { useQueryParams } from "@/hooks/useQueryParams";
import { cn } from "@/utils/cn";
import { QUERY_PARAM_KEYS } from "../../constants/filers";

interface CategoryTabsProps {
	onWillChange?: () => void;
}

export default function CategoryTabs({ onWillChange }: CategoryTabsProps) {
	const { ref, overlays, ...events } = useDragScroll<HTMLUListElement>();
	const { get, set } = useQueryParams();
	const { categories } = useCategoryStore();

	const typeParam = get(QUERY_PARAM_KEYS.TYPE);
	const type = typeParam ?? "all";

	function handleChangeType(v: string | null) {
		if (typeParam === v) {
			return;
		}

		onWillChange?.();
		set({ [QUERY_PARAM_KEYS.TYPE]: v });
	}

	return (
		<div role="group" aria-label="모임 타입 필터" className="relative">
			<ul ref={ref} className={cn(containerStyle, "flex gap-x-2.5")} {...events}>
				<li className="whitespace-nowrap">
					<TabButton selected={type === "all"} onClick={() => handleChangeType(null)}>
						전체
					</TabButton>
				</li>

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
