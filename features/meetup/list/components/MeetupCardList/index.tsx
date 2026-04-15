"use client";

import GroupCard from "@/components/ui/GroupCard";
import { useGetMeetups } from "@/features/meetup/queries";
import MeetupCardItems from "../MeetupCardItems";
import { cn } from "@/utils/cn";

const size = 10;

interface MeetupCardListProps {
	className?: string;
}
export default function MeetupCardList({ className }: MeetupCardListProps) {
	const query = useGetMeetups(size);
	const isRefetching = query.isFetching && !query.isFetchingNextPage && !query.isPending;

	return (
		<ul
			className={cn(
				"grid w-full content-start justify-items-stretch gap-4 transition-opacity duration-200 ease-in-out md:gap-6 lg:grid-cols-2",
				isRefetching && "pointer-events-none opacity-50",
				className,
			)}>
			{query.isPending ? (
				<MeetupCardSkeletonItems size={size} />
			) : (
				<MeetupCardItems query={query} />
			)}
		</ul>
	);
}

function MeetupCardSkeletonItems({ size }: { size: number }) {
	return Array.from({ length: size }).map((_, i) => (
		<li key={i} className="w-full">
			<GroupCard.Skeleton />
		</li>
	));
}
