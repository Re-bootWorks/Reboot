"use client";

import GroupCard from "@/components/ui/GroupCard";
import { formatDateTime, isDeadlinePassed, uiFormatDeadline } from "@/utils/date";
import { Meeting } from "../types";
import { checkIsConfirmed, checkIsRegClosed } from "../utils";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/providers/toast-provider";
import {
	useDeleteMeetingsFavorite,
	useDeleteMeetingsJoin,
	usePostMeetingsFavorite,
	usePostMeetingsJoin,
} from "../../queries";

export default function MeetupCard({ data }: { data: Meeting }) {
	const { handleShowToast } = useToast();
	const queryClient = useQueryClient();

	function invalidateMeetups() {
		queryClient.invalidateQueries({ queryKey: ["meetup"] });
	}
	function onSuccess(message: string) {
		handleShowToast({ message, status: "success" });
		invalidateMeetups();
	}
	function onError(error: Error) {
		handleShowToast({ message: error.message, status: "error" });
	}

	const { mutate: postFavoriteMutation, isPending: isFavoritePosting } = usePostMeetingsFavorite({
		onSuccess: () => onSuccess("모임이 찜 추가되었습니다."),
		onError,
	});
	const { mutate: deleteFavoriteMutation, isPending: isFavoriteDeleting } =
		useDeleteMeetingsFavorite({
			onSuccess: () => onSuccess("모임이 찜 해제되었습니다."),
			onError,
		});

	const { mutate: postJoinMutation, isPending: isJoinPosting } = usePostMeetingsJoin({
		onSuccess: () => onSuccess("모임에 참여되었습니다."),
		onError,
	});

	const { mutate: deleteJoinMutation, isPending: isJoinDeleting } = useDeleteMeetingsJoin({
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
			postJoinMutation(data.id);
		} else {
			deleteJoinMutation(data.id);
		}
	}

	function handleFavoriteClick() {
		if (!data.isFavorited) {
			postFavoriteMutation(data.id);
		} else {
			deleteFavoriteMutation(data.id);
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
					isPending={isJoinPosting || isJoinDeleting}
				/>
				<GroupCard.LikeButton
					onClick={handleFavoriteClick}
					isPending={isFavoritePosting || isFavoriteDeleting}
				/>
			</GroupCard.Content>
		</GroupCard>
	);
}
