"use client";

import { useRef } from "react";
import useScrollOnNextQueryChange from "@/hooks/useScrollOnNextQueryChange";
import useScrollFloatingVisibility from "@/hooks/useScrollFloatingVisibility";
import { cn } from "@/utils/cn";
import CategoryTabs from "./CategoryTabs";
import ListFilters from "./ListFilters";
import { useReviewsListScroll } from "../providers/ReviewsListScrollProvider";

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
				"flex w-full flex-col gap-2 px-1 md:gap-4 md:px-2 lg:flex-row lg:items-center lg:justify-between [&>*:nth-child(3)]:self-start",
				className,
			)}>
			<h2 id={headingId} className="sr-only">
				리뷰 필터
			</h2>
			<CategoryTabs onWillChange={onWillChange} />
			<ListFilters onWillChange={onWillChange} />
		</section>
	);
}

export default function ListControls() {
	const { markWillChange } = useReviewsListScroll();
	const triggerRef = useRef<HTMLDivElement>(null);
	const { isVisible, hasPassedThreshold } = useScrollFloatingVisibility({
		offset: MOBILE_STICKY_OFFSET,
		triggerRef,
	});
	const showMobileFloating = hasPassedThreshold && isVisible;

	return (
		<>
			<div
				ref={triggerRef}
				className="scroll-mt-12 md:sticky md:top-22 md:z-9 md:scroll-mt-22 md:bg-gray-50 md:py-3">
				<div className="mx-auto w-full max-w-7xl px-2">
					<ListControlsContent headingId="review-filter-heading" onWillChange={markWillChange} />
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
