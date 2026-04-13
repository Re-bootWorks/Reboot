import { MeetupItemResponse } from "@/features/meetup/types";
import { filterRelatedMeetings } from "@/features/meetupDetail/util";

jest.mock("@/utils/date", () => ({
	...jest.requireActual("@/utils/date"),
	isDeadlinePassed: (date: string) => {
		const fixedNow = new Date("2026-04-10T03:00:00.000Z");
		return fixedNow > new Date(date);
	},
}));

const baseMeeting: MeetupItemResponse = {
	id: 1,
	teamId: "lucky7",
	name: "테스트 모임",
	type: "달램핏",
	region: "건대입구",
	address: "서울시 광진구",
	latitude: 37.5,
	longitude: 127.0,
	dateTime: "2026-05-01T14:00:00.000Z",
	registrationEnd: "2026-04-30T14:00:00.000Z",
	capacity: 10,
	participantCount: 5,
	image: "/img.svg",
	description: "설명",
	canceledAt: null,
	confirmedAt: null,
	hostId: 1,
	createdBy: 1,
	createdAt: "2026-03-01T00:00:00.000Z",
	updatedAt: "2026-03-01T00:00:00.000Z",
	host: { id: 1, name: "홍길동", image: "/profile.svg" },
	isFavorited: false,
	isJoined: false,
	isCompleted: false,
};

// ─────────────────────────────────────────────
// filterRelatedMeetings
// ─────────────────────────────────────────────
describe("관련 모임 목록 필터링", () => {
	describe("현재 보고 있는 모임(currentUserId) 제외", () => {
		it("currentMeetingId와 일치하는 모임을 제외한다", () => {
			const meetings = [
				{ ...baseMeeting, id: 1 },
				{ ...baseMeeting, id: 2 },
				{ ...baseMeeting, id: 3 },
			];

			const result = filterRelatedMeetings(meetings, 1);
			expect(result.map((m) => m.id)).toEqual([2, 3]);
		});
	});

	describe("마감 기한이 지난 모임 제외", () => {
		it("registrationEnd가 현재 시각 보다 이전인 모임은 제외한다.", () => {
			const meetings = [
				{ ...baseMeeting, id: 2, registrationEnd: "2026-04-09T00:00:00.000Z" }, // 마감
				{ ...baseMeeting, id: 3, registrationEnd: "3000-04-20T00:00:00.000Z" }, // 마감 전
			];
			const result = filterRelatedMeetings(meetings, 99);
			expect(result.map((m) => m.id)).toEqual([3]);
		});
	});

	describe("현재 모임 제외 + 마감 기한 만료 동시 적용", () => {
		it("currentMeetingId 제외 & 마감 기한 만료를 동시에 필터링한다.", () => {
			const meetings = [
				{ ...baseMeeting, id: 1 },
				{ ...baseMeeting, id: 2, registrationEnd: "2026-04-09T00:00:00.000Z" },
				{ ...baseMeeting, id: 3 },
			];
			const result = filterRelatedMeetings(meetings, 1);
			expect(result.map((m) => m.id)).toEqual([3]);
		});
	});

	describe("엣지 케이스", () => {
		it("빈 배열을 입력하면 빈 배열을 반환한다.", () => {
			expect(filterRelatedMeetings([], 1)).toEqual([]);
		});

		it("모든 모임이 필터링 조건에 해당하면 빈 배열을 반환한다.", () => {
			const meetings = [
				{ ...baseMeeting, id: 1 },
				{ ...baseMeeting, id: 2, registrationEnd: "2026-04-09T00:00:00.000Z" },
			];
			expect(filterRelatedMeetings(meetings, 1)).toEqual([]);
		});

		it("모임이 하나이고, currentMeetingId와 일치하면 빈 배열을 반환한다.", () => {
			const meetings = [{ ...baseMeeting, id: 1 }];
			expect(filterRelatedMeetings(meetings, 1)).toEqual([]);
		});
	});
});
