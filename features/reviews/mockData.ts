import { RatingSummaryProps } from "./types";

export const MOCK_LOGIN_USER_ID = 1;

export const TAB_OPTIONS: string[] = [
	"전체",
	"자기계발",
	"운동/스포츠",
	"비즈니스",
	"운동/건강",
	"가족/육아",
	"기타",
];

// 타입 추후 추가 예정
export const SORT_OPTIONS = [
	{ label: "빠른 모임", value: "dateTimeAsc", by: "dateTime", order: "asc" },
	{ label: "나중 모임", value: "dateTimeDesc", by: "dateTime", order: "desc" },
	{ label: "마감 임박", value: "registrationEndAsc", by: "registrationEnd", order: "asc" },
	{ label: "마감 여유", value: "registrationEndDesc", by: "registrationEnd", order: "desc" },
	{
		label: "참여 여유",
		value: "participantCountAsc",
		by: "participantCount",
		order: "asc",
	},
	{ label: "참여 활발", value: "participantCountDesc", by: "participantCount", order: "desc" },
];

export const RATING_SUMMARY: RatingSummaryProps = {
	averageScore: 4.5,
	totalReviews: 42,
	oneStar: 1,
	twoStars: 2,
	threeStars: 5,
	fourStars: 14,
	fiveStars: 20,
};

import { ReviewCardProps } from "@/features/reviews/types";

export const REVIEW_CARD_MOCK_DATA: ReviewCardProps[] = [
	{
		meetingImage:
			"https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?auto=format&fit=crop&w=1200&q=80",
		score: 5,
		userImage:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
		userName: "김철수",
		createdAt: "2026-02-01T20:00:00.000Z",
		comment: "너무 좋았어요! 같이 뛰는 분위기가 좋아서 다음에도 또 참여하고 싶어요.",
		meetingName: "한강 러닝 모임",
		meetingType: "러닝",
		userId: 1,
		meetingId: 1,
	},
	{
		meetingImage: "",
		score: 4,
		userImage: null,
		userName: "이영희",
		createdAt: "2026-02-05T10:30:00.000Z",
		comment:
			"처음 가봤는데 진행이 편안했어요.\n동작 설명도 친절해서 부담 없이 따라갈 수 있었습니다.",
		meetingName: "저녁 요가 클래스",
		meetingType: "요가",
		userId: 8,
		meetingId: 2,
	},
	{
		meetingImage:
			"https://images.unsplash.com/photo-1518644961665-ed172691aaa1?auto=format&fit=crop&w=1200&q=80",
		score: 3,
		userImage: null,
		userName: "박민수",
		createdAt: "2026-02-12T18:15:00.000Z",
		comment:
			"전체적으로 괜찮았는데 공간이 조금 좁게 느껴졌어요.\n그래도 같이 운동하는 분위기는 좋았습니다.",
		meetingName: "주말 그룹 트레이닝",
		meetingType: "헬스",
		userId: 7,
		meetingId: 3,
	},
];
