import type { MeetupCreateRequest, MeetupItem, MeetupListResponse } from "@/features/meetup/types";
import { TEAM_ID } from "../constants";

const MEETINGS: MeetupListResponse = {
	data: [
		{
			id: 1,
			teamId: TEAM_ID,
			name: "모임 이름",
			type: "자기계발",
			region: "건대입구",
			address: "서울시 광진구 자양동 123-45",
			latitude: 37.5407,
			longitude: 127.0693,
			dateTime: "2026-02-10T14:00:00.000Z",
			registrationEnd: "2026-02-09T23:59:59.000Z",
			capacity: 10,
			participantCount: 5,
			image: "https://example.com/meeting.jpg",
			description: "함께 운동하며 건강을 챙겨요!",
			canceledAt: null,
			confirmedAt: null,
			hostId: 1,
			createdBy: 1,
			createdAt: "2026-02-01T10:00:00.000Z",
			updatedAt: "2026-02-01T10:00:00.000Z",
			host: {
				id: 1,
				name: "홍길동",
				image: "https://example.com/profile.jpg",
			},
			isFavorited: false,
			isJoined: false,
			isCompleted: false,
		},
	],
	nextCursor: "string",
	hasMore: true,
	totalCount: 0,
	currentOffset: 0,
	limit: 0,
};

function getMeetings() {
	return MEETINGS;
}

function postMeetings(meeting: MeetupCreateRequest) {
	const newMeeting: MeetupItem = {
		id: MEETINGS.data.length + 1,
		teamId: TEAM_ID,
		...meeting,
		participantCount: 0,
		canceledAt: null,
		confirmedAt: null,
		hostId: 1,
		createdBy: 1,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		host: { id: 1, name: "홍길동", image: "https://example.com/profile.jpg" },
		isFavorited: false,
		isJoined: false,
		isCompleted: false,
	};
	MEETINGS.data.push(newMeeting);
	return newMeeting;
}

function updateMeetings(meetingId: number, meeting: MeetupCreateRequest) {
	const targetIndex = MEETINGS.data.findIndex((v) => v.id === meetingId);

	if (targetIndex >= 0) {
		const targetMeeting = MEETINGS.data[targetIndex];
		const updatedMeeting: MeetupItem = { ...targetMeeting, ...meeting };
		MEETINGS.data[targetIndex] = updatedMeeting;
		return updatedMeeting;
	}
}

function deleteMeetings(meetingId: number) {
	MEETINGS.data = MEETINGS.data.filter((v) => v.id !== meetingId);
}

export default {
	get: getMeetings,
	post: postMeetings,
	update: updateMeetings,
	delete: deleteMeetings,
};
