import React from "react";
import { StatusLabel } from "@/components/ui/StatusLabel";
import ProgressBar from "@/components/ui/ProgressBar";
import { Participants } from "@/components/ui/Participants";
import { Participant } from "@/features/meetupDetail/types";

const MIN_CONFIRMED_COUNT = 5;

interface PersonnelProps {
	capacity: number;
	participantCount: number;
	participants: Participant[];
	confirmedAt: string | null;
}

export default function PersonnelContainer({
	capacity,
	participantCount,
	participants,
	confirmedAt,
}: PersonnelProps) {
	const isConfirmed = !!confirmedAt || participantCount >= MIN_CONFIRMED_COUNT;
	return (
		<div className="flex h-fit w-full flex-col gap-2 rounded-[20px] bg-linear-to-r from-purple-100 to-purple-200 px-6 py-6 pt-5 pb-5.5 lg:rounded-[28px] lg:px-10 lg:py-10 lg:pt-7 lg:pb-8.5">
			<div className="flex flex-col gap-3 lg:gap-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<p className="text-sm text-purple-600 lg:text-lg">
							{participantCount}
							<span className="text-gray-700">명 참여</span>
						</p>
						<Participants participants={participants} />
					</div>
					{isConfirmed && (
						<StatusLabel size="sm" className="h-6 lg:text-sm">
							개설확정
						</StatusLabel>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex flex-row items-center justify-between text-xs text-gray-600 lg:text-sm">
						<p>최소 5명</p>
						<p>최대 {capacity}명</p>
					</div>
					<ProgressBar max={capacity} current={participantCount} />
				</div>
			</div>
		</div>
	);
}
