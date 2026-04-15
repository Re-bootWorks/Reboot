// dayjs 모킹
import { Meeting } from "@/features/meetupDetail/types";
import {
	toMeetupEditData,
	validateCapacityOverParticipants,
	validateDateTimeIsFuture,
	validateDateTimeOrder,
	validateMaxCapacity,
} from "@/features/meetupDetail/edit/utils";

jest.mock("@/libs/dayjs", () => {
	const actualDayjs = jest.requireActual("dayjs");
	const mockNow = "2026-04-10T12:00:00";
	const mockDayjs = (date?: string) => actualDayjs(date ?? mockNow);
	mockDayjs.extend = actualDayjs.extend.bind(actualDayjs);

	return { __esModule: true, default: mockDayjs };
});

jest.mock("@/features/meetupDetail/components/PersonnelContainer", () => ({
	MIN_CONFIRMED_COUNT: 3,
}));

const mockMeeting: Meeting = {
	id: 1,
	teamId: "lucky7",
	name: "달램핏 모임",
	type: "달램핏",
	region: "건대입구",
	address: "서울시 광진구 자양동 123-45, 3층",
	latitude: 37.5407,
	longitude: 127.0693,
	dateTime: "2026-05-01T14:00:00.000Z",
	registrationEnd: "2026-04-27T14:00:00.000Z",
	capacity: 10,
	participantCount: 5,
	image: "/assets/img/img_empty_purple.svg",
	description: "함께 운동하며 건강을 챙겨요!",
	canceledAt: null,
	confirmedAt: null,
	hostId: 1,
	createdBy: 1,
	createdAt: "2026-03-21T14:00:00.000Z",
	updatedAt: "2026-03-21T14:00:00.000Z",
	host: { id: 1, name: "홍길동", image: "/assets/img/img_profile.svg" },
	isJoined: false,
	isFavorited: false,
};

// ─────────────────────────────────────────────
// validateCapacityOverParticipants
// ─────────────────────────────────────────────
describe("정원과 현재 참가자 수 유효성 검사", () => {
	it("정원이 참가자 수보다 많으면 true를 반환한다", () => {
		expect(validateCapacityOverParticipants(10, 5)).toBe(true);
	});

	it("정원이 참가자 수와 같으면 true를 반환한다.", () => {
		expect(validateCapacityOverParticipants(5, 5)).toBe(true);
	});

	it("정원이 참가자 수보다 작으면 false를 반환한다.", () => {
		expect(validateCapacityOverParticipants(4, 5)).toBe(false);
	});
});

// ─────────────────────────────────────────────
// validateDateTimeIsFuture
// ─────────────────────────────────────────────
describe("모임 일시와 현재 시각 유효성 검사", () => {
	it("현재 시각 이후의 날짜라면 true를 반환한다.", () => {
		expect(validateDateTimeIsFuture("2029-04-10T12:00:00")).toBe(true);
	});

	it("현재 시각 이전의 날짜라면 false를 반환한다.", () => {
		expect(validateDateTimeIsFuture("2026-04-09T12:00:00")).toBe(false);
	});

	it("현재 시각과 동일한 날짜라면 false를 반환한다.", () => {
		expect(validateDateTimeIsFuture("2026-04-10T12:00:00")).toBe(false);
	});
});

// ─────────────────────────────────────────────
// validateMaxCapacity
// ─────────────────────────────────────────────
describe("최대 정원과 최소 인원 유효성 검사", () => {
	it("최대 정원이 최소 인원보다 크면 true를 반환한다.", () => {
		expect(validateMaxCapacity(5, 3)).toBe(true);
	});

	it("최대 정원이 최소 인원과 같으면 true를 반환한다.", () => {
		expect(validateMaxCapacity(5, 5)).toBe(true);
	});

	it("최대 정원이 최소 인원보다 작으면 false를 반환한다.", () => {
		expect(validateMaxCapacity(3, 5)).toBe(false);
	});
});

// ─────────────────────────────────────────────
// validateDateTimeOrder
// ─────────────────────────────────────────────
describe("마감 일정과 모임 일정 유효성 검사", () => {
	it("마감 일정이 모임 일정보다 이전이면 true를 반환한다.", () => {
		expect(validateDateTimeOrder("2026-05-01T14:00:00", "2026-04-27T14:00:00")).toBe(true);
	});

	it("마감 일정이 모임 일정와 같으면 false를 반환한다.", () => {
		expect(validateDateTimeOrder("2026-05-01T14:00:00", "2026-05-01T14:00:00")).toBe(false);
	});

	it("마감 일정이 모임 일정보다 이후이면 false를 반환한다.", () => {
		expect(validateDateTimeOrder("2026-04-27T14:00:00", "2026-05-01T14:00:00")).toBe(false);
	});
});

// ─────────────────────────────────────────────
// toMeetupData
// ─────────────────────────────────────────────
describe("모임 상세 데이터 수정 관련 유효성 검사", () => {
	it("Meeting 데이터를 MeetupEditData 형테로 변환", () => {
		const result = toMeetupEditData(mockMeeting);
		expect(result).toMatchObject({
			name: mockMeeting.name,
			type: mockMeeting.type,
			region: mockMeeting.region,
			address: mockMeeting.address,
			capacity: mockMeeting.capacity,
			image: mockMeeting.image,
			description: mockMeeting.description,
		});
	});

	it("address를 ', ' 기준으로 분리해 _addressName, _addressDetail에 담는다.", () => {
		const result = toMeetupEditData(mockMeeting);
		expect(result._addressName).toBe("서울시 광진구 자양동 123-45");
		expect(result._addressDetail).toBe("3층");
	});

	it("addressDetail이 없으면, _addressDetail은 빈 문자열이다.", () => {
		const result = toMeetupEditData({
			...mockMeeting,
			address: "서울시 광진구 자양동 123-45",
		});
		expect(result._addressDetail).toBe("");
	});
});
