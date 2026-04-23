"use client";

import GroupCard from "@/components/ui/GroupCard";

export default function MeetupCardListSkeleton({ size }: { size: number }) {
	return Array.from({ length: size }).map((_, i) => (
		<li key={i} className="w-full">
			<GroupCard.Skeleton />
		</li>
	));
}
