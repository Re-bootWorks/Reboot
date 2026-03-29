"use client";

import GroupCard from "@/components/ui/GroupCard";
import { formatDateTime } from "@/utils/date";
import { Meeting } from "../types";
import { checkIsConfirmed, checkIsRegClosed } from "../utils";

export default function MeetupCard({ data }: { data: Meeting }) {
	const [date, time] = formatDateTime(data.dateTime);
	const status = {
		isConfirmed: checkIsConfirmed(data.confirmedAt),
		isRegClosed: checkIsRegClosed(data.registrationEnd, data.participantCount, data.capacity),
		isLiked: data.isFavorited,
		isJoined: data.isJoined,
	};
	const href = `/meetup/${data.id}`;

	return (
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
				{/* TODO: Button 클릭 시 처리 */}
				<GroupCard.JoinButton onClick={() => {}} isPending={false} />
				<GroupCard.LikeButton onClick={() => {}} isPending={false} />
			</GroupCard.Content>
		</GroupCard>
	);
}
