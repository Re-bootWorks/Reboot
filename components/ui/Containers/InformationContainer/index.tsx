"use client";

import { DeadlineTag } from "@/components/ui/Tags/DeadlineTag";
import { TimeTag } from "@/components/ui/Tags/TimeTag";
import { IcCrownOutline, IcLocation } from "@/components/ui/icons";
import Button from "@/components/ui/Buttons/Button";
import UtilityButton from "@/components/ui/Buttons/UtilityButton";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";

interface InformationContainerProps {
	name: string;
	type: string;
	region: string;
	dateTime: string;
	registrationEnd: string;
	capacity: number;
	// TODO: 추후 hostId와 currentUserId 비교로 변경 예정
	isHost: boolean;
}

export default function InformationContainer({
	name,
	type,
	region,
	dateTime,
	registrationEnd,
	isHost,
}: InformationContainerProps) {
	const actionItems = [
		{
			label: "수정하기",
			onClick: () => {},
		},
		{
			label: "삭제하기",
			onClick: () => {},
		},
	];

	return (
		<div className="flex h-50 w-85.75 flex-col gap-7 rounded-[20px] bg-white px-6 pt-5 pb-6 lg:h-70.5 lg:w-157.5 lg:gap-10 lg:rounded-4xl lg:px-10 lg:pt-8.5 lg:pb-8">
			<div className="flex w-full flex-col gap-4 lg:gap-6">
				<div className={`flex w-full items-center gap-2 ${isHost && "justify-between"}`}>
					<div className="flex items-center gap-2">
						<DeadlineTag>오늘 {registrationEnd}시 마감</DeadlineTag>
						{/* TODO: format utils 함수 구조 필요 (date / time) */}
						<TimeTag>{dateTime}</TimeTag>
						<TimeTag>{dateTime}</TimeTag>
					</div>
					{isHost && <ActionDropdown items={actionItems} />}
				</div>

				<div className="flex w-full flex-col gap-1 overflow-hidden lg:gap-3">
					<div className="flex items-center gap-1.5 overflow-hidden">
						<h1 className="truncate text-lg lg:text-5xl">{name}</h1>
						{isHost && <IcCrownOutline size="md" className="shrink-0 lg:h-8 lg:w-8" />}
					</div>

					<div className="flex items-center gap-0.5 overflow-hidden text-sm">
						<IcLocation className="h-4 w-4 shrink-0 lg:h-6 lg:w-6" />
						<span>
							{region}·{type}
						</span>
					</div>
				</div>
			</div>

			<div className="flex w-full items-center gap-4">
				<UtilityButton sizes="small" className="lg:size-15" />
				<Button
					sizes="small"
					colors="purple"
					className="flex-1 lg:h-15 lg:rounded-2xl lg:px-7.5 lg:text-xl">
					{isHost ? "공유하기" : "참여하기"}
				</Button>
			</div>
		</div>
	);
}
