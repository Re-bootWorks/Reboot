import { toReviewScore } from "./mapper";

describe("toReviewScore() 별점 확인", () => {
	test("1~5 사이의 별점 입력시 입력한 별점이 반환된다", () => {
		const result = toReviewScore(3);
		expect(result).toBe(3);
	});
	// toThrow 는 실행결과가 아닌 함수 자체를 넘김
	describe("toReviewScore 경계값 테스트", () => {
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
});
