import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import {
	postMeetingsFavorite,
	deleteMeetingsFavorite,
	postMeetingsJoin,
	deleteMeetingsJoin,
	ROUTE_MEETINGS_FAVORITES,
	ROUTE_MEETINGS_JOIN,
} from "./meetings";

const ENDPOINT_FAVORITES = (id: number) => `/api${ROUTE_MEETINGS_FAVORITES(id)}`;
const ENDPOINT_JOIN = (id: number) => `/api${ROUTE_MEETINGS_JOIN(id)}`;

describe("postMeetingsFavorite api 테스트", () => {
	test("성공 시 응답 데이터를 반환함", async () => {
		const result = await postMeetingsFavorite({ meetingId: 3 });

		expect(result).toMatchObject({ id: 3, isFavorited: true });
	});

	test("존재하지 않는 모임이면 에러를 throw함", async () => {
		await expect(postMeetingsFavorite({ meetingId: 9999 })).rejects.toThrow(
			"모임을 찾을 수 없습니다.",
		);
	});

	test("응답 바디가 없으면 기본 에러 메시지를 throw함", async () => {
		server.use(http.post(ENDPOINT_FAVORITES(9999), () => new HttpResponse(null, { status: 500 })));

		await expect(postMeetingsFavorite({ meetingId: 9999 })).rejects.toThrow(
			"모임 찜 추가에 실패했습니다.",
		);
	});
});

describe("deleteMeetingsFavorite api 테스트", () => {
	test("성공 시 응답 데이터를 반환함", async () => {
		const result = await deleteMeetingsFavorite({ meetingId: 4 });

		expect(result).toMatchObject({ message: "찜 해제 성공" });
	});

	test("존재하지 않는 모임이면 에러를 throw함", async () => {
		await expect(deleteMeetingsFavorite({ meetingId: 9999 })).rejects.toThrow(
			"모임을 찾을 수 없습니다.",
		);
	});

	test("응답 바디가 없으면 기본 에러 메시지를 throw함", async () => {
		server.use(
			http.delete(ENDPOINT_FAVORITES(9999), () => new HttpResponse(null, { status: 500 })),
		);

		await expect(deleteMeetingsFavorite({ meetingId: 9999 })).rejects.toThrow(
			"모임 찜 해제에 실패했습니다.",
		);
	});
});

describe("postMeetingsJoin api 테스트", () => {
	test("이미 참여한 모임이면 에러를 throw함", async () => {
		await expect(postMeetingsJoin({ meetingId: 1 })).rejects.toThrow("ALREADY_JOINED");
	});

	test("존재하지 않는 모임이면 에러를 throw함", async () => {
		await expect(postMeetingsJoin({ meetingId: 9999 })).rejects.toThrow("NOT_FOUND");
	});

	test("응답 바디가 없으면 기본 에러 메시지를 throw함", async () => {
		server.use(http.post(ENDPOINT_JOIN(9999), () => new HttpResponse(null, { status: 500 })));

		await expect(postMeetingsJoin({ meetingId: 9999 })).rejects.toThrow(
			"모임 참여에 실패했습니다.",
		);
	});
});

describe("deleteMeetingsJoin api 테스트", () => {
	test("성공 시 응답 데이터를 반환함", async () => {
		const result = await deleteMeetingsJoin({ meetingId: 5 });

		expect(result).toMatchObject({ message: "참여 취소 성공" });
	});

	test("존재하지 않는 모임이면 에러를 throw함", async () => {
		await expect(deleteMeetingsJoin({ meetingId: 9999 })).rejects.toThrow("NOT_FOUND");
	});

	test("응답 바디가 없으면 기본 에러 메시지를 throw함", async () => {
		server.use(http.delete(ENDPOINT_JOIN(9999), () => new HttpResponse(null, { status: 500 })));

		await expect(deleteMeetingsJoin({ meetingId: 9999 })).rejects.toThrow(
			"모임 참여 취소에 실패했습니다.",
		);
	});
});
