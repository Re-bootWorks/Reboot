import { ReviewScore } from "@/types/common";
import {
	CreatedItem,
	MeetingJoinedApiRes,
	MeetingsMyApiRes,
	MeetupItem,
	MeReviewsApiRes,
	ReviewCardItem,
} from "./types";

export function toReviewScore(score: number): ReviewScore {
	if (score >= 1 && score <= 5) {
		return score as ReviewScore;
	}

	throw new Error(`잘못된 별점 입니다. : ${score}`);
}

export function mapJoinedMeeting(item: MeetingJoinedApiRes): MeetupItem {
	return {
		id: item.id,
		name: item.name,
		region: item.region,
		dateTime: item.dateTime,
		registrationEnd: item.registrationEnd,
		capacity: item.capacity,
		participantCount: item.participantCount,
		image: item.image,
		canceledAt: item.canceledAt,
		confirmedAt: item.confirmedAt,
		hostId: item.hostId,
		isFavorited: item.isFavorited,
		isReviewed: item.isReviewed,
		isCompleted: item.isCompleted,
	};
}

export function mapMeReviews(item: MeReviewsApiRes): ReviewCardItem {
	return {
		id: item.id,
		score: toReviewScore(item.score),
		comment: item.comment,
		meetingId: item.meetingId,
		meetingType: item.meeting.type,
		meetingName: item.meeting.name,
		meetingImage: item.meeting.image,
		meetingDateTime: item.meeting.dateTime,
	};
}

export function mapMeetingsMy(item: MeetingsMyApiRes): CreatedItem {
	return {
		id: item.id,
		name: item.name,
		region: item.region,
		dateTime: item.dateTime,
		capacity: item.capacity,
		participantCount: item.participantCount,
		image: item.image,
		isFavorited: item.isFavorited,
		isCompleted: item.isCompleted,
		canceledAt: item.canceledAt,
		confirmedAt: item.confirmedAt,
	};
}
