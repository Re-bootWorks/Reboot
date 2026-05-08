import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { BASE_URL } from "@/mocks/constants";
import {
	getMeetingTypes,
	initMeetingTypes,
	ROUTE_MEETING_TYPES,
	type MeetingTypeResponse,
} from "./meetingTypes";

const ENDPOINT_MEETING_TYPES = `${BASE_URL}${ROUTE_MEETING_TYPES}`;

const mockMeetingTypes: MeetingTypeResponse = [
	{
		id: 266,
		createdAt: "2025-01-01T00:00:00Z",
		name: "자기계발",
		description: "게임, 코딩 등의 모임입니다.",
	},
	{
		id: 267,
		createdAt: "2025-01-01T00:00:00Z",
		name: "운동/스포츠",
		description: "런닝, 테니스 등의 모임입니다.",
	},
];

describe("meetingTypes api 테스트", () => {
	describe("getMeetingTypes", () => {
		test("성공 시 카테고리 목록을 반환함", async () => {
			server.use(
				http.get(ENDPOINT_MEETING_TYPES, () =>
					HttpResponse.json(mockMeetingTypes, { status: 200 }),
				),
			);

			const result = await getMeetingTypes();

			expect(result).toEqual(mockMeetingTypes);
		});

		test("실패 시 응답 메시지로 에러를 throw함", async () => {
			const errorResponse = { code: "FETCH_FAILED", message: "카테고리 조회 실패" };

			server.use(
				http.get(ENDPOINT_MEETING_TYPES, () => HttpResponse.json(errorResponse, { status: 500 })),
			);

			await expect(getMeetingTypes()).rejects.toThrow(errorResponse.message);
		});

		test("실패 시 응답 바디 파싱이 안 되면 기본 에러 메시지를 throw함", async () => {
			server.use(http.get(ENDPOINT_MEETING_TYPES, () => new HttpResponse(null, { status: 500 })));

			await expect(getMeetingTypes()).rejects.toThrow("모임 카테고리 조회에 실패했습니다.");
		});
	});

	describe("initMeetingTypes", () => {
		test("성공 시 카테고리 목록을 반환함", async () => {
			server.use(
				http.get(ENDPOINT_MEETING_TYPES, () =>
					HttpResponse.json(mockMeetingTypes, { status: 200 }),
				),
			);

			const result = await initMeetingTypes();

			expect(result).toEqual(mockMeetingTypes);
		});

		test("getMeetingTypes가 실패하면 null을 반환함", async () => {
			server.use(http.get(ENDPOINT_MEETING_TYPES, () => new HttpResponse(null, { status: 500 })));

			const result = await initMeetingTypes();

			expect(result).toBeNull();
		});
	});
});
