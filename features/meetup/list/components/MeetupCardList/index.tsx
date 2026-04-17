"use client";

import { useGetMeetups } from "@/features/meetup/queries";
import { cn } from "@/utils/cn";
import MeetupCardItems from "../MeetupCardItems";
import MeetupCardListSkeleton from "./MeetupCardListSkeleton";

interface MeetupCardListProps {
	size: number;
}
export default function MeetupCardList({ size }: MeetupCardListProps) {
	const query = useGetMeetups(size);
	const isRefetching = query.isFetching && !query.isFetchingNextPage && !query.isPending;

	return (
		<ul
			className={cn(
				"grid w-full content-start justify-items-stretch gap-4 transition-opacity duration-200 ease-in-out md:gap-6 lg:grid-cols-2",
				"mb-10 flex-1 px-4",
				"md:mb-12 md:px-0 lg:mb-26",
				isRefetching && "pointer-events-none opacity-50",
			)}>
			{query.isPending ? <MeetupCardListSkeleton size={size} /> : <MeetupCardItems query={query} />}
		</ul>
	);
}
