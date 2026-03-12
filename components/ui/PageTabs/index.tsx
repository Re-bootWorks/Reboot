"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface PageTab {
	id: string;
	label: string | React.ReactNode;
	icon?: React.ReactNode;
}
interface OnChangeProps {
	id: string;
	label: string | React.ReactNode;
}

interface PageTabsProps {
	data: PageTab[];
	defaultId?: string;
	onChange?: ({ id, label }: OnChangeProps) => void;
}
function PageTabs({ data, defaultId, onChange }: PageTabsProps) {
	const listRef = useRef<HTMLUListElement>(null);
	const indicatorRef = useRef<HTMLDivElement>(null);
	const hasClickedRef = useRef(false);
	const [activeId, setActiveId] = useState(defaultId ?? data[0].id);
	const [indicatorPos, setIndicatorPos] = useState({ left: 0, width: 0 });

	// activeId 변경 시 onChange 호출
	useEffect(() => {
		if (!onChange) return;

		const current = data.find((item) => item.id === activeId);
		if (current) {
			onChange({ id: current.id, label: current.label });
		}
	}, [activeId, onChange, data]);

	// indicator 업데이트
	useEffect(() => {
		function setIndicatorStyle() {
			if (!listRef.current) return;
			const indicatorStyle = getIndicatorStyle(listRef.current, activeId);
			setIndicatorPos(indicatorStyle);
		}
		setIndicatorStyle();
		// 브라우저 창 크기 변경 시 재업데이트
		window.addEventListener("resize", setIndicatorStyle);
		return () => window.removeEventListener("resize", setIndicatorStyle);
	}, [activeId, data]);

	function handleButtonClick(id: string) {
		// 첫 클릭 이후부터 transition 적용
		if (!hasClickedRef.current && indicatorRef.current) {
			indicatorRef.current.classList.add("transition-transform", "duration-300");
			hasClickedRef.current = true;
		}
		setActiveId(id);
	}

	return (
		<div className="relative w-full">
			<ul className="flex" ref={listRef}>
				{data.map((i) => (
					<TabItem
						key={i.id}
						id={i.id}
						label={i.label}
						icon={i.icon}
						isActive={activeId === i.id}
						onClick={() => handleButtonClick(i.id)}
					/>
				))}
			</ul>
			<div className="absolute bottom-0 h-0.5 w-full bg-gray-200" />
			<div
				ref={indicatorRef}
				className="absolute bottom-0 h-0.5 w-px origin-left bg-purple-500"
				style={{ transform: `translateX(${indicatorPos.left}px) scaleX(${indicatorPos.width})` }}
			/>
		</div>
	);
}

interface TabItemProps extends PageTab {
	isActive: boolean;
	onClick: () => void;
}
function TabItem({ id, icon, label, isActive, onClick }: TabItemProps) {
	return (
		<li data-id={id}>
			<button
				className={cn(
					"flex min-w-[113.669px] cursor-pointer items-center justify-center gap-x-2 px-8 py-2 text-sm lg:min-w-[159px] lg:px-4 lg:py-4 lg:text-xl",
					isActive ? "text-purple-600" : "text-gray-600",
				)}
				onClick={onClick}>
				{icon}
				<div>{label}</div>
			</button>
		</li>
	);
}

function getIndicatorStyle(elList: HTMLUListElement | undefined, activeId: string) {
	if (!elList) return { left: 0, width: 0 };
	const currentTab = elList.querySelector(`[data-id="${activeId}"]`) as HTMLLIElement;
	return {
		left: currentTab?.offsetLeft ?? 0,
		width: currentTab?.clientWidth ?? 0,
	};
}

export default PageTabs;
