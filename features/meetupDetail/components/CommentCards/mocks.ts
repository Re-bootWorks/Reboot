import type { Review } from "@/features/meetupDetail/types";

export const mockReviews: Review[] = [
	{
		id: 1,
		teamId: "dev-lucky7",
		meetingId: 1,
		userId: 2,
		score: 5,
		comment: "모임이 정말 유익했어요! 다음에도 꼭 참여하고 싶습니다.",
		createdAt: "2026-02-01T20:00:00.000Z",
		updatedAt: "2026-02-01T20:00:00.000Z",
		user: {
			id: 2,
			name: "김철수",
			image: "/assets/img/img_profile.svg",
		},
		meeting: {
			id: 1,
			name: "달램핏 모임",
			type: "달램핏",
			region: "건대입구",
			image: "/assets/img/img_empty_purple.svg",
			dateTime: "2026-03-23T14:00:00.000Z",
		},
	},
	{
		id: 2,
		teamId: "dev-lucky7",
		meetingId: 1,
		userId: 3,
		score: 4,
		comment: "장소가 조금 협소했지만 내용은 알찼습니다.",
		createdAt: "2026-02-02T10:00:00.000Z",
		updatedAt: "2026-02-02T10:00:00.000Z",
		user: {
			id: 3,
			name: "이영희",
			image: null,
		},
		meeting: {
			id: 1,
			name: "달램핏 모임",
			type: "달램핏",
			region: "건대입구",
			image: "/assets/img/img_empty_purple.svg",
			dateTime: "2026-03-23T14:00:00.000Z",
		},
	},
];
