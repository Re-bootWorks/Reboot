"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import ParticipantDropdown from "@/features/meetupDetail/components/Participants/ParticipantDropdown";
import { AnimatePresence } from "motion/react";
import { useParticipants } from "@/features/meetupDetail/queries";
interface ParticipantsImageProps {
	meetingId: number;
	participantCount: number;
	hostId: number;
}

const MAX_VISIBLE = 4;

export function Participants({ meetingId, participantCount, hostId }: ParticipantsImageProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const {
		data: allParticipants,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = useParticipants(meetingId);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			const target = e.target as Node;
			const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
			const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
			if (isOutsideContainer && isOutsideDropdown) {
				setIsExpanded(false);
			}
		}

		if (isExpanded) document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isExpanded]);

	const visibleParticipants = allParticipants.slice(0, MAX_VISIBLE);
	const overCount = participantCount - MAX_VISIBLE;
	const showOverCount = overCount > 0;

	return (
		<div ref={containerRef} className="relative">
			<div className="scrollbar-hide flex w-full items-center -space-x-2 overflow-x-auto py-1">
				{visibleParticipants.map((participant) => (
					<div key={participant.id} className="shrink-0">
						<Avatar
							src={participant.user.image}
							alt={participant.user.name}
							width={32}
							height={32}
						/>
					</div>
				))}
				{showOverCount && (
					<button
						type="button"
						onClick={() => setIsExpanded((prev) => !prev)}
						className="z-10 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-xs text-gray-700 hover:bg-gray-100">
						+{overCount}
					</button>
				)}
			</div>

			<AnimatePresence>
				{isExpanded && (
					<ParticipantDropdown
						participants={allParticipants}
						hasNextPage={hasNextPage}
						isFetchingNextPage={isFetchingNextPage}
						onLoadMore={fetchNextPage}
						dropdownRef={dropdownRef}
						hostId={hostId}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
