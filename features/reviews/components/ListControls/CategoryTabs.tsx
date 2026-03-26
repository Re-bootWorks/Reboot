"use client";

import TabButton from "@/components/ui/Buttons/TabButton";
import useDragScroll, { containerStyle } from "@/hooks/useDragScroll";
import { useQueryParams } from "@/hooks/useQueryParams";
import { MEETUP_TYPES, QUERY_KEYS } from "@/features/meetup/list/constants";
import { cn } from "@/utils/cn";

export default function CategoryTabs() {
	const { ref, overlays, ...events } = useDragScroll<HTMLUListElement>();
	const { get, set } = useQueryParams();

	const type = get(QUERY_KEYS.TYPE) ?? MEETUP_TYPES[0].value;

	function handleChangeType(v: string) {
		set({ [QUERY_KEYS.TYPE]: v });
	}

	return (
		<div role="group" aria-label="모임 타입 필터" className="relative">
			<ul ref={ref} className={cn(containerStyle, "flex gap-x-2.5")} {...events}>
				{MEETUP_TYPES.map((i) => (
					<li key={i.value} className="whitespace-nowrap">
						<TabButton selected={type === i.value} onClick={() => handleChangeType(i.value)}>
							{i.label}
						</TabButton>
					</li>
				))}
			</ul>
			{overlays}
		</div>
	);
}
