import { Participant } from "@/features/meetupDetail/types";
import Avatar from "@/components/ui/Avatar";

interface ParticipantsImageProps {
	participants: Participant[];
}

const MAX_VISIBLE = 5;

export function Participants({ participants }: ParticipantsImageProps) {
	const visibleParticipants = participants.slice(0, MAX_VISIBLE - 1);
	const overCount = participants.length - (MAX_VISIBLE - 1);
	const showOverCount = participants.length >= MAX_VISIBLE;

	return (
		<div className="flex items-center -space-x-2">
			{visibleParticipants.map((participant) => (
				<Avatar
					key={participant.id}
					src={participant.user.image}
					alt={participant.user.name}
					width={32}
					height={32}
					className="shrink-0"
				/>
			))}

			{showOverCount && (
				<div className="flex h-7.25 w-7.25 shrink-0 items-center justify-center rounded-full bg-white text-xs text-gray-700">
					+{overCount}
				</div>
			)}
		</div>
	);
}
