import type {
	MeetupCreateRequest,
	MeetupItem,
	MeetupListRequest,
	MeetupListResponse,
} from "@/features/meetup/types";
import { TEAM_ID } from "../../constants";
import { REVIEWS } from "../reviews/fixtures";
import { MEETINGS, PARTICIPANTS } from "./fixtures";
import { buildMeetupListResponse } from "./helpers";
import { JOINED_AT_BY_MEETING_ID } from "./joinedMeta";

function listMeetings(params: MeetupListRequest = {}): MeetupListResponse {
	return buildMeetupListResponse(MEETINGS.data, params);
}

function getMeetingById(meetingId: number) {
	return MEETINGS.data.find((m) => m.id === meetingId);
}

function postMeetings(meeting: MeetupCreateRequest) {
	const nextId = Math.max(0, ...MEETINGS.data.map((m) => m.id)) + 1;
	const newMeeting: MeetupItem = {
		id: nextId,
		teamId: TEAM_ID,
		...meeting,
		participantCount: 1,
		canceledAt: null,
		confirmedAt: null,
		hostId: 1,
		createdBy: 1,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		host: {
			id: 1,
			name: "홍길동",
			image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop",
		},
		isFavorited: false,
		isJoined: true,
		isCompleted: false,
	};
	MEETINGS.data.push(newMeeting);
	MEETINGS.totalCount = MEETINGS.data.length;
	return newMeeting;
}

function updateMeetings(meetingId: number, meeting: Partial<MeetupCreateRequest>) {
	const targetIndex = MEETINGS.data.findIndex((v) => v.id === meetingId);
	if (targetIndex >= 0) {
		const targetMeeting = MEETINGS.data[targetIndex];
		const updatedMeeting: MeetupItem = {
			...targetMeeting,
			...meeting,
			updatedAt: new Date().toISOString(),
		};
		MEETINGS.data[targetIndex] = updatedMeeting;
		return updatedMeeting;
	}
	return undefined;
}

function deleteMeetings(meetingId: number) {
	const idx = MEETINGS.data.findIndex((v) => v.id === meetingId);
	if (idx >= 0) {
		MEETINGS.data.splice(idx, 1);
		MEETINGS.totalCount = MEETINGS.data.length;
	}
	return idx >= 0;
}

export type JoinFailureReason = "NOT_FOUND" | "ALREADY_JOINED";
export type LeaveFailureReason = "NOT_FOUND" | "NOT_JOINED";

function joinMeeting(meetingId: number): { ok: true } | { ok: false; reason: JoinFailureReason } {
	const meeting = MEETINGS.data.find((m) => m.id === meetingId);
	if (!meeting) return { ok: false, reason: "NOT_FOUND" };
	if (meeting.isJoined) return { ok: false, reason: "ALREADY_JOINED" };
	meeting.participantCount += 1;
	meeting.isJoined = true;
	PARTICIPANTS.push({
		id: PARTICIPANTS.length + 1,
		teamId: TEAM_ID,
		meetingId,
		userId: 1,
		joinedAt: new Date().toISOString(),
		user: {
			id: 1,
			name: "홍길동",
			image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop",
		},
	});
	return { ok: true };
}

function leaveMeeting(meetingId: number): { ok: true } | { ok: false; reason: LeaveFailureReason } {
	const meeting = MEETINGS.data.find((m) => m.id === meetingId);
	if (!meeting) return { ok: false, reason: "NOT_FOUND" };
	if (!meeting.isJoined) return { ok: false, reason: "NOT_JOINED" };
	meeting.participantCount = Math.max(0, meeting.participantCount - 1);
	meeting.isJoined = false;
	const pIdx = PARTICIPANTS.findIndex((p) => p.meetingId === meetingId && p.userId === 1);
	if (pIdx >= 0) PARTICIPANTS.splice(pIdx, 1);
	return { ok: true };
}

function toggleFavorite(meetingId: number, add: boolean) {
	const meeting = MEETINGS.data.find((m) => m.id === meetingId);
	if (!meeting) return undefined;
	meeting.isFavorited = add;
	return meeting;
}

function getParticipants(meetingId: number) {
	const filtered = PARTICIPANTS.filter((p) => p.meetingId === meetingId);
	return { data: filtered, nextCursor: null, hasMore: false };
}

function updateStatus(meetingId: number, status: "CONFIRMED" | "CANCELED") {
	const meeting = MEETINGS.data.find((m) => m.id === meetingId);
	if (!meeting) return undefined;
	if (status === "CONFIRMED") meeting.confirmedAt = new Date().toISOString();
	if (status === "CANCELED") meeting.canceledAt = new Date().toISOString();
	meeting.updatedAt = new Date().toISOString();
	return meeting;
}

export type JoinedListFilters = {
	completed?: boolean;
	reviewed?: boolean;
};

function isReviewedByCurrentUser(meetingId: number) {
	return REVIEWS.some((r) => r.meetingId === meetingId && r.userId === 1);
}

function getJoinedMeetings(filters?: JoinedListFilters) {
	let list = MEETINGS.data.filter((m) => m.isJoined);
	if (filters?.completed === true) list = list.filter((m) => m.isCompleted);
	if (filters?.completed === false) list = list.filter((m) => !m.isCompleted);
	if (filters?.reviewed === true) list = list.filter((m) => isReviewedByCurrentUser(m.id));
	if (filters?.reviewed === false) list = list.filter((m) => !isReviewedByCurrentUser(m.id));

	const joined = list.map((m) => ({
		...m,
		joinedAt: JOINED_AT_BY_MEETING_ID[m.id] ?? m.createdAt,
		isReviewed: isReviewedByCurrentUser(m.id),
	}));
	return {
		data: joined,
		nextCursor: null,
		hasMore: false,
		totalCount: joined.length,
		currentOffset: 0,
		limit: 10,
	};
}

function getMyMeetings() {
	const my = MEETINGS.data.filter((m) => m.hostId === 1);
	return {
		data: my,
		nextCursor: null,
		hasMore: false,
		totalCount: my.length,
		currentOffset: 0,
		limit: 10,
	};
}

export default {
	list: listMeetings,
	getById: getMeetingById,
	post: postMeetings,
	update: updateMeetings,
	delete: deleteMeetings,
	join: joinMeeting,
	leave: leaveMeeting,
	toggleFavorite,
	getParticipants,
	updateStatus,
	getJoined: getJoinedMeetings,
	getMy: getMyMeetings,
};
