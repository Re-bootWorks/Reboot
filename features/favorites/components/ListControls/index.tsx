"use client";

import { useRef } from "react";
import useScrollOnNextQueryChange from "@/hooks/useScrollOnNextQueryChange";
import useScrollFloatingVisibility from "@/hooks/useScrollFloatingVisibility";
import { cn } from "@/utils/cn";
import CategoryTabs from "./CategoryTabs";
import ListFilters from "./ListFilters";

const MOBILE_STICKY_OFFSET = 48;

interface ListControlsContentProps {
	headingId: string;
	className?: string;
	onWillChange?: () => void;
}

function ListControlsContent({ headingId, className, onWillChange }: ListControlsContentProps) {
	return (
		<section
			aria-labelledby={headingId}
			className={cn(
				"flex w-full flex-col gap-2 px-1 md:gap-4 md:px-4.5 lg:flex-row lg:items-center lg:justify-between [&>*:nth-child(3)]:self-start",
				className,
			)}>
			<h2 id={headingId} className="sr-only">
				찜한 모임 목록 필터
			</h2>
			<CategoryTabs onWillChange={onWillChange} />
			<ListFilters onWillChange={onWillChange} />
		</section>
	);
}

export default function ListControls() {
	const { scrollAnchorRef, markWillChange } = useScrollOnNextQueryChange<HTMLDivElement>();
	const triggerRef = useRef<HTMLDivElement>(null);
	const { isVisible, hasPassedThreshold } = useScrollFloatingVisibility({
		offset: MOBILE_STICKY_OFFSET,
		triggerRef,
	});
	const showMobileFloating = hasPassedThreshold && isVisible;

	return (
		<>
			<div ref={scrollAnchorRef} aria-hidden="true" className="scroll-mt-12 md:scroll-mt-22" />

			<div ref={triggerRef} className="scroll-mt-12 md:sticky md:top-22 md:z-9 md:scroll-mt-22">
				<div className="md:relative md:left-1/2 md:w-screen md:max-w-[1300px] md:-translate-x-1/2 md:bg-gray-50 md:py-3 md:pl-6 lg:pl-0">
					<ListControlsContent headingId="favorites-filter-heading" onWillChange={markWillChange} />
				</div>
			</div>

			<div
				aria-hidden={!showMobileFloating}
				className={cn(
					"pointer-events-none fixed inset-x-0 top-12 z-9 transition-all duration-300 ease-out md:hidden",
					showMobileFloating
						? "visible translate-y-0 opacity-100"
						: "invisible -translate-y-full opacity-0",
				)}>
				<div className="pointer-events-auto mx-auto max-w-332 bg-gray-50 px-4 py-2 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
					<ListControlsContent
						headingId="review-filter-floating-heading"
						className="pointer-events-auto"
						onWillChange={markWillChange}
					/>
				</div>
			</div>
		</>
	);
}
