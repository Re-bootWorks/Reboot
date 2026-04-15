import dayjs from "dayjs";
import { SORT_BY_OPTIONS, SORT_ORDER_OPTIONS } from "./constants";
import {
	checkIsRegClosed,
	parseDateStringToISO,
	transformRegionData,
	transformSortByQuery,
	transformSortOrderQuery,
} from "./utils";

describe("모임 찾기 요청 파라미터(쿼리) 변환 테스트", () => {
	const defaultValue = SORT_BY_OPTIONS[0].value;

	describe("정렬 기준 요청 쿼리 값 변환 테스트", () => {
		test("정렬 기준 쿼리 값이 유효하면 그대로 반환", () => {
			const value = SORT_BY_OPTIONS[1].value;
			const result = transformSortByQuery(value);
			expect(result).toBe(value);
		});

		test("정렬 기준 쿼리 값이 없다면 클라이언트 기본값을 반환", () => {
			const nullResult = transformSortByQuery(null);
			expect(nullResult).toBe(defaultValue);

			const undefinedResult = transformSortByQuery(undefined);
			expect(undefinedResult).toBe(defaultValue);
		});

		test("정렬 기준 쿼리 값이 유효하지 않다면 클라이언트 기본값을 반환", () => {
			const invalidValue = "invalidValue";
			const result = transformSortByQuery(invalidValue);
			expect(result).toBe(defaultValue);
		});
	});

	describe("정렬 순서 요청 쿼리 값 변환 테스트", () => {
		const defaultValue = SORT_ORDER_OPTIONS[0].value;

		test("정렬 순서 쿼리 값이 유효하면 그대로 반환", () => {
			const value = SORT_ORDER_OPTIONS[1].value;
			const result = transformSortOrderQuery(value);
			expect(result).toBe(value);
		});

		test("정렬 순서 쿼리 값이 없다면 클라이언트 기본값을 반환", () => {
			const nullResult = transformSortOrderQuery(null);
			expect(nullResult).toBe(defaultValue);

			const undefinedResult = transformSortOrderQuery(undefined);
			expect(undefinedResult).toBe(defaultValue);
		});

		test("정렬 순서 쿼리 값이 유효하지 않다면 클라이언트 기본값을 반환", () => {
			const invalidValue = "invalidValue";
			const result = transformSortOrderQuery(invalidValue);
			expect(result).toBe(defaultValue);
		});
	});
});

describe("모임 카드의 모집 마감 여부 테스트", () => {
	const afterToday = dayjs().add(1, "day").format("YYYY-MM-DDTHH:mm:ss.SSSZ");
	const beforeToday = dayjs().subtract(1, "day").format("YYYY-MM-DDTHH:mm:ss.SSSZ");
	const validParticipantCount = 2;
	const capacity = 10;

	test("모임 정원이 초과되지 않고 모집 마감일이 지나지 않았으면 모집이 마감되지 않아야 함", () => {
		const result = checkIsRegClosed(afterToday, validParticipantCount, capacity);
		expect(result).toBe(false);
	});

	test("모임 정원이 초과되면 모집이 마감되어야 함", () => {
		const result = checkIsRegClosed(afterToday, capacity, capacity);
		expect(result).toBe(true);
	});

	test("모집 마감일이 지났으면 모집이 마감되어야 함", () => {
		const result = checkIsRegClosed(beforeToday, validParticipantCount, capacity);
		expect(result).toBe(true);
	});
});

describe("날짜 문자열 형식 변환 테스트", () => {
	test("YYYY-MM-DD 형식 문자열이 ISO 형식(KST 시간대)으로 변환되어야 함", () => {
		const value = "2026-04-14";
		const expected = "2026-04-14T00:00:00.000+09:00";
		const result = parseDateStringToISO(value);
		expect(result).toBe(expected);
	});
});

describe("지역 쿼리 값을 드롭다운 데이터로 변환 테스트", () => {
	test("지역 쿼리 값이 없다면 region, district 프로퍼티가 null이어야 함", () => {
		const nullResult = transformRegionData(null);
		expect(nullResult.region).toStrictEqual(null);
		expect(nullResult.district).toStrictEqual(null);

		const undefinedResult = transformRegionData(undefined);
		expect(undefinedResult.region).toStrictEqual(null);
		expect(undefinedResult.district).toStrictEqual(null);
	});

	test("지역 쿼리 값이 유효하면 region, district 프로퍼티가 존재해야 함", () => {
		const value = "서울 강남구";
		const result = transformRegionData(value);
		expect(result.region).toStrictEqual({ value: "서울", label: "서울" });
		expect(result.district).toStrictEqual({ value: "강남구", label: "강남구" });
	});
});
