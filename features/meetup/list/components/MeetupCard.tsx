"use client";

import GroupCard from "@/components/ui/GroupCard";
import { formatDateTime } from "@/utils/date";
import { Suspense } from "react";
import { Meeting } from "../types";

export default function MeetupCard({ data }: { data: Meeting }) {
	const href = `/meetup-detail/${data.id}`;
	const [date, time] = formatDateTime(data.dateTime);
	const status = {
		isConfirmed: data.confirmedAt !== null,
		isRegClosed: data.participantCount >= data.capacity,
		isLiked: data.isFavorited,
		// isJoined: data.isJoined,
		isJoined: false,
	};

	return (
		<Suspense fallback={<GroupCard.Skeleton />}>
			<GroupCard id={data.id} href={href} status={status}>
				<GroupCard.Image src={data.image} alt={data.name} />
				<GroupCard.Content>
					<GroupCard.Title name={data.name} />
					<GroupCard.SubTitle type={data.type} region={data.region} />
					<GroupCard.BadgeGroup date={date} time={time} />
					<GroupCard.ParticipantBar
						capacity={data.capacity}
						participantCount={data.participantCount}
					/>
					<GroupCard.JoinButton onClick={() => {}} isPending={false} />
					<GroupCard.LikeButton onClick={() => {}} isPending={false} />
				</GroupCard.Content>
			</GroupCard>
		</Suspense>
	);
}
