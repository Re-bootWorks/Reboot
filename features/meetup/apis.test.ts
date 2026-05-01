import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { getKakaoPlace, getMeetups, postMeetup } from "./apis";
import { buildMeetupListResponse } from "@/mocks/data/meetings/helpers";
import { MEETINGS } from "@/mocks/data/meetings/fixtures";
import type { KakaoPlaceItem, MeetupCreateRequest } from "./types";

const ENDPOINT_KAKAO_PLACE = "/api/kakao/place";
const ENDPOINT_MEETINGS = "/api/meetings";

describe("getKakaoPlace api 테스트", () => {
	const mockPlaceItemData: KakaoPlaceItem[] = [
		{
			id: "1",
			address_name: "서울 강남구 역삼동 123",
			road_address_name: "서울 강남구 테헤란로 123",
			place_name: "테스트 장소",
			x: "127.0276",
			y: "37.4979",
			category_group_code: "",
			category_group_name: "",
			category_name: "",
			distance: "",
			phone: "",
			place_url: "",
		},
	];

	test("성공 시 KakaoPlaceItem 목록 데이터를 반환함", async () => {
		server.use(
			http.get(ENDPOINT_KAKAO_PLACE, () =>
				HttpResponse.json({ documents: mockPlaceItemData }, { status: 200 }),
			),
		);

		const result = await getKakaoPlace("역삼");

		expect(result).toEqual(mockPlaceItemData);
	});

	test("실패 시 응답 메시지로 에러를 throw함", async () => {
		const errorResponse = { message: "카카오 API 오류" };
		server.use(
			http.get(ENDPOINT_KAKAO_PLACE, () => HttpResponse.json(errorResponse, { status: 500 })),
		);

		await expect(getKakaoPlace("역삼")).rejects.toThrow(errorResponse.message);
	});

	test("응답 body가 없으면 기본 에러 메시지를 throw함", async () => {
		server.use(http.get(ENDPOINT_KAKAO_PLACE, () => new HttpResponse(null, { status: 500 })));

		await expect(getKakaoPlace("역삼")).rejects.toThrow(
			"카카오 장소 검색 API 호출에 실패했습니다.",
		);
	});
});

describe("getMeetups api 테스트", () => {
	test("성공 시 MeetupListResponse 데이터를 반환함", async () => {
		const result = await getMeetups({});
		const expected = buildMeetupListResponse(MEETINGS.data, {});

		expect(result).toEqual(expected);
	});

	test("실패 시 응답 메시지로 에러를 throw함", async () => {
		const errorResponse = { message: "알 수 없는 서버 에러가 발생했습니다." };
		server.use(
			http.get(ENDPOINT_MEETINGS, () => HttpResponse.json(errorResponse, { status: 500 })),
		);

		await expect(getMeetups({})).rejects.toThrow(errorResponse.message);
	});

	test("응답 body가 없으면 기본 에러 메시지를 throw함", async () => {
		server.use(http.get(ENDPOINT_MEETINGS, () => new HttpResponse(null, { status: 500 })));

		await expect(getMeetups({})).rejects.toThrow("모임 목록을 불러오는데 실패했습니다.");
	});
});

describe("postMeetup api 테스트", () => {
	const mockCreateData: MeetupCreateRequest = {
		name: "테스트 모임",
		type: "자기계발",
		region: "서울특별시 강남구",
		address: "서울특별시 강남구 역삼동 123",
		latitude: 37.4979,
		longitude: 127.0276,
		dateTime: "2026-06-01T10:00:00.000Z",
		registrationEnd: "2026-05-31T23:59:59.000Z",
		capacity: 10,
		image: "https://example.com/image.png",
		description: "테스트 모임입니다.",
	};

	test("성공 시 생성된 모임을 반환함", async () => {
		const result = await postMeetup(mockCreateData);

		expect(result).toMatchObject({
			name: mockCreateData.name,
			type: mockCreateData.type,
		});
		expect(result.id).toBeDefined();
	});

	test("실패 시 응답 메시지로 에러를 throw함", async () => {
		const errorResponse = { message: "알 수 없는 클라이언트 문제가 발생했습니다." };
		server.use(
			http.post(ENDPOINT_MEETINGS, () => HttpResponse.json(errorResponse, { status: 400 })),
		);

		await expect(postMeetup(mockCreateData)).rejects.toThrow(errorResponse.message);
	});

	test("응답 body가 없으면 기본 에러 메시지를 throw함", async () => {
		server.use(http.post(ENDPOINT_MEETINGS, () => new HttpResponse(null, { status: 500 })));

		await expect(postMeetup(mockCreateData)).rejects.toThrow("모임 생성에 실패했습니다.");
	});
});
