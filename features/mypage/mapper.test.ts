import { mapJoinedMeeting, mapMeReviews, mapUsersMeMeetings, toReviewScore } from "./mapper";
import { mockMeetingJoinedApiRes, mockMeMeetingApiRes, mockMeReviewsApiRes } from "./mockData";

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

	describe("mapUsersMeMeetings() 필드 확인", () => {
		test("API 응답을 MeetupDetailItem 형태로 매핑한다", () => {
			const result = mapUsersMeMeetings(mockMeMeetingApiRes);

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
				role: "host",
			});
		});

		test("mapper에 없는 필드는 포함하지 않는다", () => {
			const result = mapUsersMeMeetings(mockMeMeetingApiRes);

			expect(result).not.toHaveProperty("teamId");
			expect(result).not.toHaveProperty("address");
			expect(result).not.toHaveProperty("host");
			expect(result).not.toHaveProperty("createdAt");
			expect(result).not.toHaveProperty("joinedAt");
		});

		test("이미지가 null이어도 그대로 반환한다", () => {
			const input = { ...mockMeMeetingApiRes, image: null };
			const result = mapUsersMeMeetings(input);

			expect(result.image).toBeNull();
		});

		test("canceledAt과 confirmedAt에 값이 있으면 그대로 반환한다", () => {
			const input = {
				...mockMeMeetingApiRes,
				canceledAt: "2026-03-31T09:41:49.482Z",
				confirmedAt: "2026-03-31T09:40:02.178Z",
			};
			const result = mapUsersMeMeetings(input);

			expect(result.canceledAt).toBe("2026-03-31T09:41:49.482Z");
			expect(result.confirmedAt).toBe("2026-03-31T09:40:02.178Z");
		});
		test("mapJoinedMeeting와 달리 role를 반환한다 ", () => {
			const result = mapUsersMeMeetings(mockMeMeetingApiRes);

			expect(result.role).toBe("host");
		});
	});

	describe("mapJoinedMeeting() 필드 확인", () => {
		test("API 응답을 MeetupItem 형태로 매핑한다", () => {
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

		test("mapper에 없는 필드는 포함하지 않는다", () => {
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

	describe("mapMeReviews() 필드 확인", () => {
		test("중첩된 meeting 필드를 평탄화하여 반환한다", () => {
			const result = mapMeReviews(mockMeReviewsApiRes);

			expect(result).toEqual({
				id: 123,
				score: 5,
				comment: "함께 공부해서 좋았어요",
				createdAt: "2026-04-08T06:22:04.892Z",
				meetingId: 1020,
				meetingType: "자기계발",
				meetingName: "코딩 스터디",
				meetingImage: "https://example.com/image.jpg",
				meetingDateTime: "2026-04-02T16:05:00.000Z",
			});
		});
		test("score가 toReviewScore를 통해 ReviewScore 타입으로 반환된다", () => {
			const result = mapMeReviews(mockMeReviewsApiRes);

			expect(result.score).toBe(5);
		});
		test("score가 유효하지 않으면 에러를 던진다", () => {
			const input = { ...mockMeReviewsApiRes, score: 0 };

			expect(() => mapMeReviews(input)).toThrow("잘못된 별점 입니다. : 0");
		});
		test("원본 meeting 객체는 필드에 포함되지 않는다", () => {
			const result = mapMeReviews(mockMeReviewsApiRes);

			expect(result).not.toHaveProperty("meeting");
		});
	});
});
