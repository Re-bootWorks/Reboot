import { Participant } from "@/features/meetupDetail/types";
import Image from "next/image";

interface ParticipantsImageProps {
	participants: Participant[];
}

const MAX_VISIBLE = 5;
const DEFAULT_PROFILE = "/assets/img/img_profile.svg";

export function Participants({ participants }: ParticipantsImageProps) {
	const visibleParticipants = participants.slice(0, MAX_VISIBLE - 1);
	const overCount = participants.length - (MAX_VISIBLE - 1);
	const showOverCount = participants.length >= MAX_VISIBLE;

	return (
		<div className="flex items-center -space-x-2">
			{visibleParticipants.map((participant) => (
				<div
					key={participant.id}
					className="flex h-7.25 w-7.25 shrink-0 items-center justify-center overflow-hidden rounded-full">
					<Image
						src={participant.user.image ?? DEFAULT_PROFILE}
						alt={participant.user.name}
						width={32}
						height={32}
						className="h-full w-full object-cover"
						priority
					/>
				</div>
			))}

			{showOverCount && (
				<div className="flex h-7.25 w-7.25 shrink-0 items-center justify-center rounded-full bg-white text-xs text-gray-700">
					+{overCount}
				</div>
			)}
		</div>
	);
}
