"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface PageTabsProps {
	defaultId?: string;
	onChange?: ({ id, label }: OnChangeParams) => void;
	children: React.ReactNode;
}

function PageTabs({ defaultId, onChange, children }: PageTabsProps) {
	const listRef = useRef<HTMLUListElement>(null);
	const indicatorRef = useRef<HTMLDivElement>(null);
	const hasClickedRef = useRef(false);
	const [activeId, setActiveId] = useState(defaultId ?? getFirstDataId(listRef.current));
	const [indicatorStyle, setindicatorStyle] = useState({ left: 0, width: 0 });

	// indicator 위치와 크기 갱신
	useEffect(() => {
		function update() {
			if (!listRef.current) return;
			const tab = getActiveTab(listRef.current, activeId);
			if (!tab) return;
			setindicatorStyle({ left: tab.offsetLeft, width: tab.clientWidth });
		}
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, [activeId]);

	function updateActiveId({ id, label }: OnChangeParams) {
		setActiveId(id);
		// onChange 콜백 호출
		if (onChange) {
			onChange({ id, label });
		}
	}

	function addTransition() {
		if (!hasClickedRef.current && indicatorRef.current) {
			// 클릭 이후부터 transition 추가
			indicatorRef.current.classList.add("transition-transform", "duration-300");
			hasClickedRef.current = true;
		}
	}

	return (
		<TabsContext.Provider value={{ activeId, updateActiveId, addTransition }}>
			<div className="relative w-full">
				<ul className="flex" ref={listRef}>
					{children}
				</ul>
				<div className="absolute bottom-0 h-0.5 w-full bg-gray-200" />
				<div
					ref={indicatorRef}
					className="absolute bottom-0 h-0.5 w-px origin-left bg-purple-500"
					style={{
						// transform scale 사용 시 브라우저 배율을 변경할 경우 문제 발생
						width: `${indicatorStyle.width}px`,
						transform: `translateX(${indicatorStyle.left}px)`,
					}}
				/>
			</div>
		</TabsContext.Provider>
	);
}

interface TabItemProps {
	id: string;
	icon?: React.ReactNode;
	children: React.ReactNode;
}

function TabItem({ id, icon, children }: TabItemProps) {
	const { activeId, updateActiveId, addTransition } = useTabs();
	const isActive = activeId === id;

	return (
		<li data-id={id}>
			<button
				className={cn(
					"flex min-w-[113.669px] cursor-pointer items-center justify-center gap-x-2 px-8 py-2 text-sm md:min-w-[159px] md:px-4 md:py-4 md:text-xl",
					isActive ? "text-purple-600" : "text-gray-600",
				)}
				onClick={() => {
					updateActiveId({ id, label: children });
					addTransition();
				}}>
				{icon}
				<div className="whitespace-nowrap">{children}</div>
			</button>
		</li>
	);
}
interface OnChangeParams {
	id: string;
	label: string | React.ReactNode;
}

// ----- utils -----
type ActiveId = string | null | undefined;
type ActiveTab = HTMLLIElement | null | undefined;
type TabList = HTMLUListElement | null | undefined;

function getActiveTab(list: TabList, activeId: ActiveId): ActiveTab {
	let tab: ActiveTab;
	tab = list?.querySelector(`[data-id="${activeId}"]`) ?? null;
	if (!tab) {
		tab = list?.children[0] as HTMLLIElement;
	}
	return tab;
}

function getFirstDataId(list: TabList): ActiveId {
	return list?.querySelector("[data-id]")?.getAttribute("data-id");
}

// ----- context -----
interface TabsContextValue {
	activeId: ActiveId;
	updateActiveId: ({ id, label }: OnChangeParams) => void;
	addTransition: () => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
	const ctx = useContext(TabsContext);
	if (!ctx) throw new Error("PageTabs.Item must be used inside PageTabs.");
	return ctx;
}

PageTabs.Item = TabItem;

export default PageTabs;
