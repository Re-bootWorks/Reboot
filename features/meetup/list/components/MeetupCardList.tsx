"use client";

import { useGetMeetups } from "@/features/meetup/queries";
import { useQueryParams } from "@/hooks/useQueryParams";
import { QUERY_KEYS } from "../constants";
import { Meeting } from "../types";
import {
	transformQueryValue,
	transformTypeValue,
	transformSortByQuery,
	transformSortOrderQuery,
} from "../utils";
import MeetupCard from "@/features/meetup/list/components/MeetupCard";
import GroupCard from "@/components/ui/GroupCard";
import Empty from "./Emtpy";
import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import LoaderDots from "@/components/ui/LoaderDots";

export default function MeetupCardList() {
	const { get } = useQueryParams();
	const size = 10;
	const { data, error, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetMeetups({
		type: transformTypeValue(get(QUERY_KEYS.TYPE)),
		region: transformQueryValue(get(QUERY_KEYS.REGION)),
		date: transformQueryValue(get(QUERY_KEYS.DATE)),
		sortBy: transformSortByQuery(get(QUERY_KEYS.SORT_BY)),
		sortOrder: transformSortOrderQuery(get(QUERY_KEYS.SORT_ORDER)),
		size,
	});
	const loadMoreRef = useRef<HTMLDivElement>(null);
	useIntersectionObserver({
		targetRef: loadMoreRef,
		onIntersect: fetchNextPage,
		isEnabled: hasNextPage && !isFetchingNextPage,
	});

	return (
		<ul className="grid flex-1 justify-items-stretch gap-4 md:gap-6 lg:grid-cols-2">
			{isLoading ? (
				<MeetupCardSkeletonList size={size} />
			) : (
				<>
					<MeetupCardLoadedList data={data?.pages.flatMap((page) => page.data)} />
					{isFetchingNextPage && <MeetupCardSkeletonList size={size} />}
				</>
			)}
			{hasNextPage && (
				<LastItem ref={loadMoreRef}>{isFetchingNextPage && <LoaderDots size="lg" />}</LastItem>
			)}
			{error && <LastItem>에러가 발생했습니다.</LastItem>}
		</ul>
	);
}

interface LastItemProps {
	ref?: React.RefObject<HTMLDivElement | null>;
	children: React.ReactNode;
}
function LastItem({ ref, children }: LastItemProps) {
	return (
		<li className="col-span-full py-4">
			<div className="flex w-full items-center justify-center" ref={ref}>
				{children}
			</div>
		</li>
	);
}

function MeetupCardLoadedList({ data }: { data: Meeting[] | undefined }) {
	if (data?.length === 0) {
		return <Empty />;
	}
	return data?.map((item) => (
		<li key={item.id} className="w-full">
			<MeetupCard data={item} />
		</li>
	));
}

function MeetupCardSkeletonList({ size }: { size: number }) {
	return Array.from({ length: size }).map((_, i) => (
		<li key={i} className="w-full">
			<GroupCard.Skeleton />
		</li>
	));
}
