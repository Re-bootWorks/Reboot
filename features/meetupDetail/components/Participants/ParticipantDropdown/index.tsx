"use client";

import { Participant } from "@/features/meetupDetail/types";
import { useEffect, useRef } from "react";
import Avatar from "@/components/ui/Avatar";
import { motion } from "motion/react";
import { IcCrownOutline } from "@/components/ui/icons";
import LoaderDots from "@/components/ui/LoaderDots";

interface ParticipantDropdownProps {
	participants: Participant[];
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	onLoadMore: () => void;
	dropdownRef: React.RefObject<HTMLDivElement | null>;
	hostId: number;
}

export default function ParticipantDropdown({
	participants,
	hasNextPage,
	isFetchingNextPage,
	onLoadMore,
	dropdownRef,
	hostId,
}: ParticipantDropdownProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		function handleScroll() {
			if (!el) return;

			const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;

			if (isBottom && hasNextPage && !isFetchingNextPage) {
				onLoadMore();
			}
		}

		el.addEventListener("scroll", handleScroll);
		return () => el.removeEventListener("scroll", handleScroll);
	}, [hasNextPage, isFetchingNextPage, onLoadMore]);

	return (
		<motion.div
			ref={dropdownRef}
			initial={{ opacity: 0, y: -8 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -8 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="scrollbar-hide absolute top-10 left-24 z-50 min-w-48 rounded-2xl border border-gray-100 bg-white py-2 shadow-lg">
			<div ref={scrollRef} className="max-h-60 overflow-y-auto">
				{participants.map((participant) => (
					<div key={participant.id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
						<Avatar
							src={participant.user.image}
							alt={participant.user.name}
							width={32}
							height={32}
							className="shrink-0"
						/>
						<div className="flex w-full justify-between">
							<span className="truncate text-sm text-gray-700">{participant.user.name}</span>
							{participant.userId === hostId && <IcCrownOutline size="sm" className="shrink-0" />}
						</div>
					</div>
				))}
				{isFetchingNextPage && (
					<div className="flex w-full items-center justify-center py-2">
						<LoaderDots size="sm" />
					</div>
				)}
			</div>
		</motion.div>
	);
}
