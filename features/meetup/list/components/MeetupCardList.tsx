"use client";

import { MeetupCardSkeletonItems } from "@/features/meetup/list/components/MeetupCardItems";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const size = 10;
const MeetupCardItems = dynamic(() => import("@/features/meetup/list/components/MeetupCardItems"), {
	ssr: false,
	loading: () => <MeetupCardSkeletonItems size={size} />,
});

export default function MeetupCardListWrapper() {
	return (
		<ul className="grid h-full w-full justify-items-stretch gap-4 md:gap-6 lg:grid-cols-2">
			<Suspense fallback={<MeetupCardSkeletonItems size={size} />}>
				<MeetupCardItems size={size} />
			</Suspense>
		</ul>
	);
}
