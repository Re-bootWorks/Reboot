/**
 * 관련 모임 필터링
 * - 현재 보고 있는 모임 제외
 * - 마감기한이 끝난 모임 제외
 * */
import { MeetupItemResponse } from "@/features/meetup/types";
import { isDeadlinePassed } from "@/utils/date";

export function filterRelatedMeetings(
	meetings: MeetupItemResponse[],
	currentMeetingId: number,
): MeetupItemResponse[] {
	return meetings.filter(
		(meet) => meet.id !== currentMeetingId && !isDeadlinePassed(meet.registrationEnd),
	);
}
