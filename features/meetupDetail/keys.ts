/**
 * meetupDetail query/mutation Key 관리 파일
 *
 * 현재는 기존 queries.ts & mutations.tsDML 의 key 선언과 병행 유지합니다.
 * 추후 팀 전체 key 통합 시, ex) queryKeys.ts로 이동하고,
 * 기존 선언 및 import 경로를 일괄 변경합니다.
 * */

export const meetupDetailQueryKeys = {
	meeting: (meetingId: number) => ["meetupDetail", "meeting", meetingId] as const,
	participants: (meetingId: number) => ["meetupDetail", "participants", meetingId] as const,
	reviews: (meetingId: number, cursor?: string) =>
		["meetupDetail", "reviews", meetingId, cursor] as const,
	related: {
		all: () => ["meetupDetail", "related"] as const,
		detail: (meetingId: number, region: string, type: string) =>
			["meetupDetail", "related", meetingId, region, type] as const,
	},
};

export const meetupDetailMutationKeys = {
	join: ["meetupDetail", "join", "post"] as const,
	cancelJoin: ["meetupDetail", "join", "delete"] as const,
	favorite: ["meetupDetail", "favorite"] as const,
	editMeeting: ["meetupDetail", "meeting", "patch"] as const,
	deleteMeeting: ["meetupDetail", "meeting", "delete"] as const,
	editReview: ["meetupDetail", "review", "patch"] as const,
	deleteReview: ["meetupDetail", "review", "delete"] as const,
};
