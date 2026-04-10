"use client";
import Image from "next/image";
import UtilityButton from "@/components/ui/Buttons/UtilityButton";
import { DeadlineTag } from "@/components/ui/Tags/DeadlineTag";
import { TimeTag } from "@/components/ui/Tags/TimeTag";
import { IcLocation } from "@/components/ui/icons";
import { isDeadlinePassed, uiFormatDate, uiFormatDeadline, uiFormatTime } from "@/utils/date";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/modal.store";
import { useFavoriteMutation } from "@/features/meetupDetail/mutations";
import { useUser } from "@/hooks/useUser";

interface CompactCardsProps {
	id: number;
	isFavorited: boolean;
	registrationEnd: string;
	dateTime: string;
	name: string;
	type: string;
	region: string;
	image: string;
}

export default function CompactCards({
	id,
	registrationEnd,
	dateTime,
	name,
	type,
	region,
	image,
	isFavorited,
}: CompactCardsProps) {
	const { user, isPending: isMePending } = useUser();
	const { openLogin } = useModalStore();
	const { mutate: toggleFavorite, isPending: isFavoritePending } = useFavoriteMutation(id);

	const router = useRouter();
	const isClosed = isDeadlinePassed(registrationEnd);

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isMePending) return;
		if (!user) {
			openLogin();
			return;
		}
		toggleFavorite({ currentState: isFavorited });
	};
	return (
		<div
			className="flex w-full shrink-0 flex-col gap-2.5 md:gap-3.5"
			onClick={() => router.push(`/meetup/${id}`)}>
			<div className="relative aspect-square w-full overflow-hidden rounded-2xl md:rounded-3xl">
				<Image alt={name} src={image} fill className="object-cover" />
				<UtilityButton
					sizes="small"
					pressed={isFavorited}
					isPending={isFavoritePending}
					onClick={handleFavoriteClick}
					className="absolute right-3.5 bottom-3.5 md:right-5 md:bottom-5 md:h-12 md:w-12"
				/>
			</div>
			<div className="flex w-full flex-col gap-1.5 p-1 md:gap-4">
				<div className="flex h-fit w-fit flex-col gap-1.5 md:flex-row">
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
				<div className="flex h-fit w-full flex-col gap-0.5">
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
