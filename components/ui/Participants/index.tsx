"use client";

import { useState } from "react";
import { Participant } from "@/features/meetupDetail/types";
import Avatar from "@/components/ui/Avatar";

interface ParticipantsImageProps {
	participants: Participant[];
}

const MAX_VISIBLE = 4;

export function Participants({ participants }: ParticipantsImageProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const visibleParticipants = isExpanded ? participants : participants.slice(0, MAX_VISIBLE);

	const overCount = participants.length - MAX_VISIBLE;
	const showOverCount = !isExpanded && overCount > 0;

	return (
		<div className="flex items-center -space-x-2 overflow-x-auto">
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
				<button
					type="button"
					onClick={() => setIsExpanded(true)}
					className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-xs text-gray-700 hover:bg-gray-100">
					+{overCount}
				</button>
			)}
			{isExpanded && (
				<button
					type="button"
					onClick={() => setIsExpanded(false)}
					className="ml-3 shrink-0 text-xs whitespace-nowrap text-gray-500 hover:text-gray-700">
					접기
				</button>
			)}
		</div>
	);
}
