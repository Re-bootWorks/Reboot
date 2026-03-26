"use client";
import Image from "next/image";
import UtilityButton from "@/components/ui/Buttons/UtilityButton";
import { DeadlineTag } from "@/components/ui/Tags/DeadlineTag";
import { TimeTag } from "@/components/ui/Tags/TimeTag";
import { IcLocation } from "@/components/ui/icons";
import { isDeadlinePassed, uiFormatDate, uiFormatDeadline, uiFormatTime } from "@/utils/date";

interface CompactCardsProps {
	registrationEnd: string;
	dateTime: string;
	name: string;
	type: string;
	region: string;
	isPressed: boolean;
	onPress: () => void;
}

export default function CompactCards({
	registrationEnd,
	dateTime,
	name,
	type,
	region,
	isPressed,
	onPress,
}: CompactCardsProps) {
	const isClosed = isDeadlinePassed(registrationEnd);
	return (
		<div className="flex h-67.5 w-40.5 flex-col gap-2.5 md:h-71.5 md:w-75.5 md:gap-3.5">
			<div className="relative h-40.5 w-40.5 overflow-hidden rounded-2xl md:h-45 md:w-75.5 md:rounded-3xl">
				<Image
					alt={"모임 이미지"}
					src="/assets/img/img_empty_purple.svg"
					fill
					className="object-cover"
				/>
				<UtilityButton
					sizes="small"
					pressed={isPressed}
					onClick={onPress}
					className="absolute right-3.5 bottom-3.5 md:right-5 md:bottom-5 md:h-12 md:w-12"
				/>
			</div>
			<div className="flex h-24.5 w-40.5 flex-col gap-1.5 p-1 md:h-23 md:w-75.5 md:gap-4">
				<div className="flex h-12.5 w-28.25 flex-col gap-1.5 md:flex-row">
					{!isClosed && (
						<DeadlineTag size="sm" className="md:h-6 md:text-sm">
							{uiFormatDeadline(registrationEnd)}
						</DeadlineTag>
					)}
					<div className="flex gap-2.5 md:gap-2">
						<TimeTag size="sm" className="md:h-6 md:text-sm">
							{uiFormatDate(dateTime)}
						</TimeTag>
						<TimeTag size="sm" className="md:h-6 md:text-sm">
							{uiFormatTime(dateTime)}
						</TimeTag>
					</div>
				</div>
				<div className="flex h-10.5 w-38.5 flex-col gap-0.5 md:h-13 md:w-73.5">
					<h2 className="truncate text-base font-semibold md:text-xl">{name}</h2>
					<div className="flex items-center gap-0.5">
						<IcLocation size="xxs" className="md:h-4 md:w-4" />
						<span className="text-xs font-medium text-gray-600 md:text-sm">
							{region}·{type}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
