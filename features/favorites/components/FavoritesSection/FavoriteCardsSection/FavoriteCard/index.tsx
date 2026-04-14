"use client";

import GroupCard from "@/components/ui/GroupCard";
import { useDeleteMeetupFavorite, usePostMeetupFavorite } from "@/features/favorites/mutations";
import { FavoriteCardItem, FavoriteCardItemSelected } from "@/features/favorites/types";
import { useMeetupToggle } from "@/features/meetup/list/hooks";
import { checkIsConfirmed, checkIsRegClosed } from "@/features/meetup/list/utils";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/providers/toast-provider";
import { formatDateTime, uiFormatDeadline } from "@/utils/date";
import { useState } from "react";

interface FavoriteCardProps {
	data: FavoriteCardItem;
	setSelectedData: (data: FavoriteCardItemSelected) => void;
	openModalFn: () => void;
}

export default function FavoriteCard({
	data: favorite,
	setSelectedData,
	openModalFn,
}: FavoriteCardProps) {
	const [isFavorited, setIsFavorited] = useState(true);
	const [date, time] = formatDateTime(favorite.meetingDateTime);

	const status = {
		isConfirmed: checkIsConfirmed(favorite.confirmedAt),
		isRegClosed: checkIsRegClosed(
			favorite.registrationEnd,
			favorite.participantCount,
			favorite.capacity,
		),
		isLiked: isFavorited,
		isJoined: favorite.isJoined,
		isCompleted: favorite.isCompleted,
	};

	const href = `/meetup/${favorite.meetingId}`;

	const { user } = useUser();
	const { handleShowToast } = useToast();
	const { onMutate, onSuccess, onError } = useMeetupToggle(favorite.meetingId, "isFavorited");

	const postFavoriteMutation = usePostMeetupFavorite(favorite.meetingId, {
		onMutate,
		onSuccess: () => onSuccess("모임이 찜 추가되었습니다."),
		onError,
	});

	const deleteFavoriteMutation = useDeleteMeetupFavorite(favorite.meetingId, {
		onMutate,
		onSuccess: () => onSuccess("모임이 찜 해제되었습니다."),
		onError,
	});

	function handleClickJoin() {
		if (user?.id) {
			setSelectedData({ ...favorite, date, time });
			openModalFn();
			return;
		}

		handleShowToast({ message: "로그인 후 이용해주세요.", status: "error" });
	}

	function handleClickFavorite() {
		if (user?.id) {
			if (!isFavorited) {
				postFavoriteMutation.mutate();
				setIsFavorited(true);
			} else {
				deleteFavoriteMutation.mutate();
				setIsFavorited(false);
			}
			return;
		}

		handleShowToast({ message: "로그인 후 이용해주세요.", status: "error" });
	}

	return (
		<GroupCard id={favorite.id} href={href} status={status}>
			<GroupCard.Image src={favorite.meetingImage} alt={favorite.meetingName} />

			<GroupCard.Content>
				<GroupCard.Title name={favorite.meetingName} />
				<GroupCard.SubTitle region={favorite.meetingRegion} type={favorite.meetingType} />
				<GroupCard.BadgeGroup
					date={date}
					time={time}
					deadlineText={
						!status.isRegClosed ? uiFormatDeadline(favorite.registrationEnd) : undefined
					}
				/>
				<GroupCard.ParticipantBar
					capacity={favorite.capacity}
					participantCount={favorite.participantCount}
				/>
				<GroupCard.JoinButton
					onClick={handleClickJoin}
					isPending={postFavoriteMutation.isPending || deleteFavoriteMutation.isPending}
				/>
				<GroupCard.LikeButton
					onClick={handleClickFavorite}
					isPending={postFavoriteMutation.isPending || deleteFavoriteMutation.isPending}
				/>
			</GroupCard.Content>
		</GroupCard>
	);
}
