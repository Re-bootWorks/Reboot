"use client";

import GroupCard from "@/components/ui/GroupCard";
import { formatDateTime, uiFormatDeadline } from "@/utils/date";
import type { MeetupItem, MeetupItemSelected } from "../../types";
import { checkIsConfirmed, checkIsRegClosed } from "../utils";
import { useDeleteMeetupFavorite, usePostMeetupFavorite } from "../../queries";
import { useUserStore } from "@/store/user.store";
import { useMeetupToggle } from "../hooks";
import { useToast } from "@/providers/toast-provider";

interface MeetupCardProps {
	data: MeetupItem;
	setSelectedData: (data: MeetupItemSelected) => void;
	openModalFn: () => void;
}
export default function MeetupCard({ data, setSelectedData, openModalFn }: MeetupCardProps) {
	const [date, time] = formatDateTime(data.dateTime);
	const status = {
		isConfirmed: checkIsConfirmed(data.confirmedAt),
		isRegClosed: checkIsRegClosed(data.registrationEnd, data.participantCount, data.capacity),
		isLiked: data.isFavorited,
		isJoined: data.isJoined,
		isCompleted: data.isCompleted,
	};
	const href = `/meetup/${data.id}`;

	const { user } = useUserStore();
	const { handleShowToast } = useToast();
	const { onMutate, onSuccess, onError } = useMeetupToggle(data.id, "isFavorited");
	const postFavoriteMutation = usePostMeetupFavorite(data.id, {
		onMutate,
		onSuccess: () => onSuccess("모임이 찜 추가되었습니다."),
		onError,
	});
	const deleteFavoriteMutation = useDeleteMeetupFavorite(data.id, {
		onMutate,
		onSuccess: () => onSuccess("모임이 찜 해제되었습니다."),
		onError,
	});

	function handleClickJoin() {
		if (user) {
			setSelectedData({ ...data, date, time });
			openModalFn();
		} else {
			handleShowToast({ message: "로그인 후 이용해주세요.", status: "error" });
		}
	}

	function handleClickFavorite() {
		if (user) {
			if (!data.isFavorited) {
				postFavoriteMutation.mutate();
			} else {
				deleteFavoriteMutation.mutate();
			}
		} else {
			handleShowToast({ message: "로그인 후 이용해주세요.", status: "error" });
		}
	}

	return (
		<GroupCard id={data.id} href={href} status={status}>
			<GroupCard.Image src={data.image} alt={data.name} />
			<GroupCard.Content>
				<GroupCard.Title name={data.name} />
				<GroupCard.SubTitle type={data.type} region={data.region} />
				<GroupCard.BadgeGroup
					date={date}
					time={time}
					deadlineText={!status.isRegClosed ? uiFormatDeadline(data.registrationEnd) : undefined}
				/>
				<GroupCard.ParticipantBar
					capacity={data.capacity}
					participantCount={data.participantCount}
				/>
				<GroupCard.JoinButton onClick={handleClickJoin} />
				<GroupCard.LikeButton
					onClick={handleClickFavorite}
					isPending={postFavoriteMutation.isPending || deleteFavoriteMutation.isPending}
				/>
			</GroupCard.Content>
		</GroupCard>
	);
}
