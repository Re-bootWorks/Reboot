import { MeMeetingApiRes, UserProfile } from "@/features/mypage/types";
import { MeetingJoinedApiRes, MeReviewsApiRes } from "./types";

// mock
export const mockMeMeetingApiRes: MeMeetingApiRes = {
	id: 1000,
	teamId: "lucky7",
	name: "코딩 스터디",
	type: "문화생활",
	region: "경기 수원시 영통구",
	address: "경기 수원시 영통구 원천동 산 5-1, 상세주소",
	latitude: 37.28295793156606,
	longitude: 127.0435528563181,
	dateTime: "2026-03-31T16:05:00.000Z",
	registrationEnd: "2026-03-31T16:00:00.000Z",
	capacity: 2,
	participantCount: 2,
	image: "https://example.com/host.jpg",
	description: "함께 공부해요",
	canceledAt: null,
	confirmedAt: null,
	hostId: 1234,
	createdAt: "2026-03-31T09:41:49.482Z",
	updatedAt: "2026-03-31T09:42:02.178Z",
	host: {
		id: 1234,
		name: "홍길동",
		image: "https://example.com/host.jpg",
	},
	createdBy: 1234,
	isFavorited: false,
	joinedAt: "2026-03-31T09:41:50.024Z",
	isReviewed: false,
	isCompleted: true,
	role: "host",
};

export const mockMeetingJoinedApiRes: MeetingJoinedApiRes = {
	id: 1000,
	teamId: "lucky7",
	name: "코딩 스터디",
	type: "문화생활",
	region: "경기 수원시 영통구",
	address: "경기 수원시 영통구 원천동 산 5-1, 상세주소",
	latitude: 37.28295793156606,
	longitude: 127.0435528563181,
	dateTime: "2026-03-31T16:05:00.000Z",
	registrationEnd: "2026-03-31T16:00:00.000Z",
	capacity: 2,
	participantCount: 2,
	image: "https://example.com/host.jpg",
	description: "함께 공부해요",
	canceledAt: null,
	confirmedAt: null,
	hostId: 1234,
	createdAt: "2026-03-31T09:41:49.482Z",
	updatedAt: "2026-03-31T09:42:02.178Z",
	host: {
		id: 1234,
		name: "홍길동",
		image: "https://example.com/host.jpg",
	},
	createdBy: 1234,
	isFavorited: false,
	joinedAt: "2026-03-31T09:41:50.024Z",
	isReviewed: false,
	isCompleted: true,
};

export const mockMeReviewsApiRes: MeReviewsApiRes = {
	id: 123,
	score: 5,
	comment: "함께 공부해서 좋았어요",
	meetingId: 1020,
	meeting: {
		id: 1020,
		type: "자기계발",
		name: "코딩 스터디",
		image: "https://example.com/image.jpg",
		dateTime: "2026-04-02T16:05:00.000Z",
	},
	createdAt: "2026-04-08T06:22:04.892Z",
};

export const mockUserProfile: UserProfile = {
	id: 1234,
	name: "홍길동",
	email: "test@example.com",
	image: "https://example.com/host.jpg",
};
