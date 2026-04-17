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

	return query.isPending ? (
		<MeetupCardListSkeleton size={size} />
	) : (
		<MeetupCardItems
			query={query}
			className={cn(isRefetching && "pointer-events-none opacity-50")}
		/>
	);
}
