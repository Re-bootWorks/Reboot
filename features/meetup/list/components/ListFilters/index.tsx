"use client";

import { useEffect, useRef, useState } from "react";
import { useCategoryStore } from "@/store/category.store";
import {
	CATEGORY_TYPE_ALL,
	QUERY_KEYS,
	SORT_BY_OPTIONS,
	SORT_ORDER_OPTIONS,
} from "@/features/meetup/list/constants";
import { cn } from "@/utils/cn";
import { getBreakpoint } from "@/utils/style";
import { getSortByItem, getSortOrderItem, transformRegionData } from "@/features/meetup/list/utils";
import { validateText } from "@/features/meetup/utils";
import { useQueryParams } from "@/hooks/useQueryParams";
import useDragScroll, { containerStyle } from "@/hooks/useDragScroll";
import useMediaQuery from "@/hooks/useMediaQuery";
import useScrollSticky from "@/hooks/useScrollSticky";
import TabButton from "@/components/ui/Buttons/TabButton";
import DateFilter from "@/components/ui/Filter/DateFilter";
import RegionFilter from "@/components/ui/Filter/RegionFilter";
import type { Option } from "@/components/ui/Filter/RegionFilter/option";
import { FilterDropdown } from "@/components/ui/Filter/FilterDropdown";
import SearchInput from "@/components/ui/SearchInput";
import IcSearch from "@/components/ui/icons/IcSearch";

interface ListFiltersProps {
	/** 최상위 컨테이너 클래스 */
	className?: string;
}
export default function ListFilters({ className }: ListFiltersProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const isExpanded = useScrollSticky();
	const { ref: scrollRef, overlays, ...events } = useDragScroll<HTMLUListElement>();
	const isLg = useMediaQuery(getBreakpoint("lg"));
	const [isKeywordOpen, setIsKeywordOpen] = useState(isLg);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	useEffect(() => {
		if (!isLoaded) return;
		setIsKeywordOpen(isLg);
	}, [isLg, isLoaded]);

	return (
		<div
			ref={containerRef}
			className={cn(
				"flex flex-col justify-center gap-y-2",
				"md:gap-4 lg:flex-row lg:items-start",
				"sticky z-1 transition-[top] duration-300",
				isExpanded ? "top-12 md:top-[88px]" : "-top-full",
				className,
			)}>
			<div className="relative min-w-0">
				<ul ref={scrollRef} className={cn(containerStyle, "flex gap-x-2.5")} {...events}>
					<KeywordToggle
						isLoaded={isLoaded}
						isKeywordOpen={isKeywordOpen}
						onClick={() => setIsKeywordOpen((prev) => !prev)}
					/>
					<TypeFilters />
				</ul>
				{overlays}
				<KeywordFilterWrapper isLoaded={isLoaded} isKeywordOpen={isKeywordOpen}>
					<KeywordFilter />
				</KeywordFilterWrapper>
			</div>
			<DropdownFilters />
		</div>
	);
}

interface FilterItemProps {
	/** 텍스트 또는 컴포넌트 라벨 */
	name?: string;
	/** 컴포넌트 라벨 */
	children?: React.ReactNode;
	/** 선택 여부 */
	selected: boolean;
	/** 클릭 핸들러 */
	onClick: () => void;
	/** 비활성화 여부 */
	disabled?: boolean;
	/** 버튼 추가 클래스 */
	className?: string;
}
function FilterItem({ name, children, selected, onClick, disabled, className }: FilterItemProps) {
	return (
		<li className="whitespace-nowrap">
			<TabButton selected={selected} onClick={onClick} disabled={disabled} className={className}>
				{children ?? name}
			</TabButton>
		</li>
	);
}

// 좌측 모임 타입 버튼 목록
function TypeFilters() {
	const { get, set } = useQueryParams();
	const { categories } = useCategoryStore();
	const type = get(QUERY_KEYS.TYPE) ?? CATEGORY_TYPE_ALL.name;

	function handleChangeType(v: string | null) {
		set({ [QUERY_KEYS.TYPE]: v });
	}

	return (
		<>
			<FilterItem
				key={CATEGORY_TYPE_ALL.id}
				name={CATEGORY_TYPE_ALL.name}
				selected={type === CATEGORY_TYPE_ALL.name}
				onClick={() => handleChangeType(CATEGORY_TYPE_ALL.name)}
			/>
			{categories.map((i) => (
				<FilterItem
					key={i.id}
					name={i.name}
					selected={type === i.name}
					onClick={() => handleChangeType(i.name)}
				/>
			))}
		</>
	);
}

// 검색창 토글 버튼
interface KeywordToggleProps {
	/** 미디어 쿼리 로드 여부 */
	isLoaded: boolean;
	/** 검색 키워드 필터 열림 여부 */
	isKeywordOpen: boolean;
	/** 검색 키워드 필터 열림 여부 변경 핸들러 */
	onClick: () => void;
}
function KeywordToggle({ isLoaded, isKeywordOpen, onClick }: KeywordToggleProps) {
	return (
		<FilterItem
			disabled={!isLoaded}
			onClick={onClick}
			selected={isLoaded && isKeywordOpen}
			className={cn(
				!isLoaded && "border-2 border-gray-200",
				isLoaded && "border-2 border-purple-500",
				isLoaded && isKeywordOpen && "bg-transparent text-purple-500 hover:text-purple-700",
				isLoaded &&
					!isKeywordOpen &&
					"bg-purple-500 text-white hover:border-purple-600 hover:bg-purple-600",
			)}>
			<IcSearch color="currentColor" />
		</FilterItem>
	);
}

// 키워드 검색 필터 wrapper
interface KeywordFilterWrapperProps {
	/** 미디어 쿼리 로드 여부 */
	isLoaded: boolean;
	/** 검색 키워드 필터 열림 여부 */
	isKeywordOpen: boolean;
	/** 검색 키워드 필터 컴포넌트 */
	children: React.ReactNode;
}
function KeywordFilterWrapper({ isLoaded, isKeywordOpen, children }: KeywordFilterWrapperProps) {
	return (
		<div
			className={cn(
				"grid transition-[grid-template-rows] duration-300 ease-out",
				// JS 실행 전 CSS로 레이아웃 고정
				!isLoaded && "grid-rows-[0fr] lg:grid-rows-[1fr]",
				isLoaded && isKeywordOpen && "grid-rows-[1fr] lg:grid-rows-[1fr]",
				isLoaded && !isKeywordOpen && "grid-rows-[0fr] lg:grid-rows-[0fr]",
			)}>
			<div className="min-h-0 overflow-hidden">
				<div className="m-0.5 mt-2.5">{children}</div>
			</div>
		</div>
	);
}

// 키워드 검색 필터
function KeywordFilter() {
	const { get, set } = useQueryParams();
	const keywordInputRef = useRef<HTMLInputElement>(null);
	const [keyword, setKeyword] = useState(get(QUERY_KEYS.KEYWORD) ?? "");

	function handleChangeKeyword(e: React.ChangeEvent<HTMLInputElement>) {
		setKeyword(e.target.value);
	}

	function handleClickKeywordSubmit() {
		if (validateText(keyword)) {
			set({ [QUERY_KEYS.KEYWORD]: keyword });
		} else {
			set({ [QUERY_KEYS.KEYWORD]: null });
		}
	}

	function handleKeyDownKeyword(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") handleClickKeywordSubmit();
	}

	function handleClickKeywordClear() {
		setKeyword("");
		set({ [QUERY_KEYS.KEYWORD]: null });
	}

	return (
		<SearchInput
			ref={keywordInputRef}
			placeholder="모임을 검색해보세요."
			value={keyword}
			onChange={handleChangeKeyword}
			onKeyDown={handleKeyDownKeyword}
			onSearchClick={handleClickKeywordSubmit}
			onClear={handleClickKeywordClear}
		/>
	);
}

// 우측 드롭다운 필터 목록
export type RegionFilterValue = {
	region: Option | null;
	district: Option | null;
};
export type RegionFilterParams = {
	fullLabel: string;
} & RegionFilterValue;
function DropdownFilters() {
	const { get, set } = useQueryParams();
	const dateStart = get(QUERY_KEYS.DATE_START) ?? "";
	const dateEnd = get(QUERY_KEYS.DATE_END) ?? "";
	const region = transformRegionData(get(QUERY_KEYS.REGION));
	const sortBy = getSortByItem(get(QUERY_KEYS.SORT_BY));
	const sortOrder = getSortOrderItem(get(QUERY_KEYS.SORT_ORDER));

	const date = {
		from: dateStart ? dateStart.split("T")[0] : "",
		to: dateEnd ? dateEnd.split("T")[0] : "",
	};

	function handleChangeDate(v: { from: string; to: string }) {
		set({
			[QUERY_KEYS.DATE_START]: v.from,
			[QUERY_KEYS.DATE_END]: v.to,
		});
	}
	function handleChangeRegion(data: RegionFilterParams) {
		set({ [QUERY_KEYS.REGION]: data.fullLabel });
	}
	function handleChangeSortOrder(v: string) {
		set({ [QUERY_KEYS.SORT_ORDER]: v });
	}
	function handleChangeSortBy(v: string) {
		set({ [QUERY_KEYS.SORT_BY]: v });
	}

	return (
		<div className="flex items-center gap-x-1.5 lg:ml-auto">
			<DateFilter value={date} onChange={handleChangeDate} />
			<RegionFilter value={region} onChange={handleChangeRegion} />
			<FilterDropdown value={sortBy.label} items={SORT_BY_OPTIONS} onChange={handleChangeSortBy} />
			<FilterDropdown
				value={sortOrder.label}
				items={SORT_ORDER_OPTIONS}
				onChange={handleChangeSortOrder}
			/>
		</div>
	);
}
