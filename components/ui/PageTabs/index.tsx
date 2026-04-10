"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import useDragScroll, { containerStyle } from "@/hooks/useDragScroll";
import useIndicator from "./useIndicator";
import PageTab from "../PageTab";
import { cn } from "@/utils/cn";

interface PageTabsProps {
	/** 초기 활성 탭 ID (마운트 시 1회만 사용) */
	defaultId?: string;
	/** 페이지 탭 변경 시 호출되는 콜백 */
	onChange?: ({ id, label }: OnChangeParams) => void;
	/** 페이지 탭 아이템 컴포넌트들 */
	children: React.ReactNode;
	className?: string;
}

function PageTabs({ defaultId, onChange, children, className }: PageTabsProps) {
	const listRef = useRef<HTMLUListElement>(null);
	const [activeId, setActiveId] = useState(defaultId);
	const { ref, overlays, style, ...events } = useDragScroll();
	const { indicatorRef, style: indicatorStyle, addTransition } = useIndicator(listRef, activeId);

	// defaultId 가 없을 경우 첫 번째 data-id 사용
	useEffect(() => {
		if (!listRef.current || defaultId) return;
		const firstDataId = getFirstDataId(listRef.current);
		if (firstDataId) {
			setActiveId(firstDataId);
		}
	}, [defaultId]);

	function updateActiveId({ id, label }: OnChangeParams) {
		setActiveId(id);
		// onChange 콜백 호출
		if (onChange) {
			onChange({ id, label });
		}
	}

	return (
		<TabsContext.Provider value={{ activeId, updateActiveId, addTransition }}>
			<div className={cn("relative w-full", className)}>
				<div ref={ref} className={containerStyle} style={style} {...events}>
					<div className="relative w-fit min-w-full">
						<ul className="flex w-full" ref={listRef} role="tablist">
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
				</div>
				{overlays}
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
	btnClassName?: string;
}

function TabItem({ id, icon, children, className, btnClassName, ...props }: TabItemProps) {
	const { activeId, updateActiveId, addTransition } = useTabs();

	return (
		<li
			data-id={id}
			className={cn("flex grow justify-center sm:grow-0", className)}
			role="presentation">
			<PageTab
				className={btnClassName}
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
type TabList = HTMLUListElement | null | undefined;

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
