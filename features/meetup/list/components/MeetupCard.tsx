"use client";

import GroupCard from "@/components/ui/GroupCard";
import { formatDateTime, isDeadlinePassed, uiFormatDeadline } from "@/utils/date";
import { MeetupItem } from "../types";
import { checkIsConfirmed, checkIsRegClosed } from "../utils";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/providers/toast-provider";
import {
	useDeleteMeetupFavorite,
	useDeleteMeetupJoin,
	usePostMeetupFavorite,
	usePostMeetupJoin,
} from "../../queries";

export default function MeetupCard({ data }: { data: MeetupItem }) {
	const { handleShowToast } = useToast();
	const queryClient = useQueryClient();

	function invalidateMeetups() {
		queryClient.invalidateQueries({ queryKey: ["meetup"] });
		queryClient.invalidateQueries({ queryKey: ["mypage", "meetups"] });
		queryClient.invalidateQueries({ queryKey: ["mypage", "created"] });
	}
	function onSuccess(message: string) {
		handleShowToast({ message, status: "success" });
		invalidateMeetups();
	}
	function onError(error: Error) {
		handleShowToast({ message: error.message, status: "error" });
	}

	const postFavoriteMutation = usePostMeetupFavorite(data.id, {
		onSuccess: () => onSuccess("모임이 찜 추가되었습니다."),
		onError,
	});
	const deleteFavoriteMutation = useDeleteMeetupFavorite(data.id, {
		onSuccess: () => onSuccess("모임이 찜 해제되었습니다."),
		onError,
	});

	const postJoinMutation = usePostMeetupJoin(data.id, {
		onSuccess: () => onSuccess("모임에 참여되었습니다."),
		onError,
	});

	const deleteJoinMutation = useDeleteMeetupJoin(data.id, {
		onSuccess: () => onSuccess("모임 참여가 취소되었습니다."),
		onError,
	});

	const [date, time] = formatDateTime(data.dateTime);
	const status = {
		isConfirmed: checkIsConfirmed(data.confirmedAt),
		isRegClosed: checkIsRegClosed(data.registrationEnd, data.participantCount, data.capacity),
		isLiked: data.isFavorited,
		isJoined: data.isJoined,
	};
	const href = `/meetup/${data.id}`;

	function handleJoinClick() {
		if (!data.isJoined) {
			postJoinMutation.mutate();
		} else {
			deleteJoinMutation.mutate();
		}
	}

	function handleFavoriteClick() {
		if (!data.isFavorited) {
			postFavoriteMutation.mutate();
		} else {
			deleteFavoriteMutation.mutate();
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
					deadlineText={
						!isDeadlinePassed(data.registrationEnd)
							? uiFormatDeadline(data.registrationEnd)
							: undefined
					}
				/>
				<GroupCard.ParticipantBar
					capacity={data.capacity}
					participantCount={data.participantCount}
				/>
				<GroupCard.JoinButton
					onClick={handleJoinClick}
					isPending={postJoinMutation.isPending || deleteJoinMutation.isPending}
				/>
				<GroupCard.LikeButton
					onClick={handleFavoriteClick}
					isPending={postFavoriteMutation.isPending || deleteFavoriteMutation.isPending}
				/>
			</GroupCard.Content>
		</GroupCard>
	);
}
