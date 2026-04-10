import { mapJoinedMeeting, toReviewScore } from "./mapper";
import { mockMeetingJoinedApiRes } from "./mockData";

describe("mypage mapper", () => {
	describe("toReviewScore() 별점 확인", () => {
		test("유효한 별점 3점 입력시 3이 반환된다", () => {
			const result = toReviewScore(3);
			expect(result).toBe(3);
		});
		// toThrow 는 실행결과가 아닌 함수 자체를 넘김
		test("0점 입력시 에러가 발생한다", () => {
			expect(() => toReviewScore(0)).toThrow("잘못된 별점 입니다. : 0");
		});
		test("6점 입력시 에러가 발생한다", () => {
			expect(() => toReviewScore(6)).toThrow("잘못된 별점 입니다. : 6");
		});
		test("음수 입력시 에러가 발생한다", () => {
			expect(() => toReviewScore(-1)).toThrow("잘못된 별점 입니다. : -1");
		});
	});

	describe("mapJoinedMeeting() 필드 확인", () => {
		test("API 응답을 JoinedMeeting 형태로 매핑한다", () => {
			const result = mapJoinedMeeting(mockMeetingJoinedApiRes);

			expect(result).toEqual({
				id: 1000,
				name: "코딩 스터디",
				region: "경기 수원시 영통구",
				dateTime: "2026-03-31T16:05:00.000Z",
				registrationEnd: "2026-03-31T16:00:00.000Z",
				capacity: 2,
				participantCount: 2,
				image: "https://example.com/host.jpg",
				canceledAt: null,
				confirmedAt: null,
				hostId: 1234,
				isFavorited: false,
				isReviewed: false,
				isCompleted: true,
			});
		});

		test("mapper에 없는 필드는 포함하지 않는다 ", () => {
			const result = mapJoinedMeeting(mockMeetingJoinedApiRes);

			expect(result).not.toHaveProperty("teamId");
			expect(result).not.toHaveProperty("address");
			expect(result).not.toHaveProperty("host");
			expect(result).not.toHaveProperty("createdAt");
			expect(result).not.toHaveProperty("joinedAt");
		});

		test("이미지가 null이어도 그대로 반환한다", () => {
			const input = { ...mockMeetingJoinedApiRes, image: null };
			const result = mapJoinedMeeting(input);

			expect(result.image).toBeNull();
		});

		test("canceledAt과 confirmedAt에 값이 있으면 그대로 반환한다", () => {
			const input = {
				...mockMeetingJoinedApiRes,
				canceledAt: "2026-03-31T09:41:49.482Z",
				confirmedAt: "2026-03-31T09:40:02.178Z",
			};
			const result = mapJoinedMeeting(input);

			expect(result.canceledAt).toBe("2026-03-31T09:41:49.482Z");
			expect(result.confirmedAt).toBe("2026-03-31T09:40:02.178Z");
		});
	});
});
