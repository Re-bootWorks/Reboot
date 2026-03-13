"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import PageTab from "../PageTab";

interface PageTabsProps {
	/** 초기 활성 탭 ID (마운트 시 1회만 사용) */
	defaultId?: string;
	/** 페이지 탭 변경 시 호출되는 콜백 */
	onChange?: ({ id, label }: OnChangeParams) => void;
	/** 페이지 탭 아이템 컴포넌트들 */
	children: React.ReactNode;
}

function PageTabs({ defaultId, onChange, children }: PageTabsProps) {
	const listRef = useRef<HTMLUListElement>(null);
	const indicatorRef = useRef<HTMLDivElement>(null);
	const hasClickedRef = useRef(false);
	const [activeId, setActiveId] = useState(defaultId);
	const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

	// defaultId 가 없을 경우 첫 번째 data-id 사용
	useEffect(() => {
		if (!listRef.current || typeof defaultId === "string") return;
		const firstDataId = getFirstDataId(listRef.current);
		if (firstDataId) {
			setActiveId(firstDataId);
		}
	}, []);

	// indicator 위치와 크기 갱신
	useLayoutEffect(() => {
		function update() {
			if (!listRef.current) return;
			const tab = getActiveTab(listRef.current, activeId);
			if (!tab) return;
			setIndicatorStyle({ left: tab.offsetLeft, width: tab.clientWidth });
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
			indicatorRef.current.classList.add(
				"transition-transform",
				"transition-width",
				"duration-300",
			);
			hasClickedRef.current = true;
		}
	}

	return (
		<TabsContext.Provider value={{ activeId, updateActiveId, addTransition }}>
			<div className="relative w-full">
				<ul className="flex" ref={listRef} role="tablist">
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

interface TabItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** 식별 ID */
	id: string;
	/** 아이콘 */
	icon?: React.ReactNode;
	/** 텍스트 또는 컴포넌트 라벨 */
	children: React.ReactNode;
}

function TabItem({ id, icon, children, ...props }: TabItemProps) {
	const { activeId, updateActiveId, addTransition } = useTabs();

	return (
		<li data-id={id}>
			<PageTab
				isActive={activeId === id}
				hasBorder={false}
				onClick={() => {
					updateActiveId({ id, label: children });
					addTransition();
				}}
				icon={icon}
				role="tab"
				{...props}>
				{children}
			</PageTab>
		</li>
	);
}
interface OnChangeParams {
	id: string;
	label: React.ReactNode;
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
