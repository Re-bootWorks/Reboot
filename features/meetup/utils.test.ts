import {
	getAddress,
	getRegion,
	splitAddress,
	validateCapacity,
	validatePlaceSearch,
	validateText,
} from "./utils";

describe("모임 생성 데이터 유효성 검사 테스트", () => {
	describe("모임 이름 유효성 검사 테스트", () => {
		test("모임 이름이 유효하면 true를 반환", () => {
			const value = "나의 모임";
			const result = validateText(value);
			expect(result).toBe(true);
		});

		test("모임 이름이 유효하지 않으면 false를 반환", () => {
			const value = "  ";
			const result = validateText(value);
			expect(result).toBe(false);
		});
	});

	describe("모임 정원 유효성 검사 테스트", () => {
		test("유한한 양의 정수면 true를 반환", () => {
			expect(validateCapacity(1)).toBe(true);
			expect(validateCapacity(2)).toBe(true);
			expect(validateCapacity(100)).toBe(true);
			expect(validateCapacity("12")).toBe(true);
		});

		test("0·음수·소수·비유한·null·undefined면 false를 반환", () => {
			expect(validateCapacity(0)).toBe(false);
			expect(validateCapacity(-1)).toBe(false);
			expect(validateCapacity(2.5)).toBe(false);
			expect(validateCapacity(Number.NaN)).toBe(false);
			expect(validateCapacity(Number.POSITIVE_INFINITY)).toBe(false);
			expect(validateCapacity(null)).toBe(false);
			expect(validateCapacity(undefined)).toBe(false);
		});

		test("빈 문자열·숫자가 아닌 문자열·소수 문자열이면 false를 반환", () => {
			expect(validateCapacity("")).toBe(false);
			expect(validateCapacity("abc")).toBe(false);
			expect(validateCapacity("2.5")).toBe(false);
		});
	});

	describe("선택 주소의 region 변환 테스트", () => {
		test("선택 주소에서 region을 추출하여 반환", () => {
			const value = "서울 중구 태평로1가 31";
			const result = getRegion(value);
			expect(result).toBe("서울 중구");
		});

		test("선택 주소가 도인 경우 올바른 region을 반환", () => {
			const value = "경기 용인시 처인구 포곡읍 전대리 310";
			const result = getRegion(value);
			expect(result).toBe("경기 용인시 처인구");
		});

		test("선택 주소에 대구가 포함된 경우 올바른 region을 반환", () => {
			const value = "대구 중구 동인동1가 2-1";
			const result = getRegion(value);
			expect(result).toBe("대구 중구");
		});

		test("선택 주소에 특별자치시, 특별자치도가 포함된 경우 해당 값 제거", () => {
			const sejongValue = "세종특별자치시 세종동 1203";
			const sejongResult = getRegion(sejongValue);
			expect(sejongResult).toBe("세종");

			const jejuValue = "제주특별자치도 서귀포시 안덕면 상창리 271";
			const jejuResult = getRegion(jejuValue);
			expect(jejuResult).toBe("제주 서귀포시");
		});
	});
});

describe("장소 검색 시 입력 값 유효성 검사 테스트", () => {
	test("장소 검색 시 입력 값이 완성된 경우 true를 반환", () => {
		const value = "서울 강남구";
		const result = validatePlaceSearch(value);
		expect(result).toBe(true);
	});

	test("장소 검색 시 특수문자가 들어간 경우 false를 반환", () => {
		const value = "서울 강남구?";
		const result = validatePlaceSearch(value);
		expect(result).toBe(false);
	});

	test("장소 검색 시 입력 중인 경우 false를 반환", () => {
		const value = "서울 강남구 ㅇ";
		const result = validatePlaceSearch(value);
		expect(result).toBe(false);
	});
});

describe("주소 값 통합 및 분리 테스트", () => {
	const addressName = "서울 중구 태평로1가 31";
	const addressDetail = "서울특별시청";
	const address = "서울 중구 태평로1가 31, 서울특별시청";

	test("주소를 통합하여 올바른 형식으로 반환", () => {
		const result = getAddress(addressName, addressDetail);
		expect(result).toBe(address);
	});

	test("주소를 분리하여 올바른 형식으로 반환", () => {
		const result = splitAddress(address);
		expect(result).toStrictEqual({
			addressName,
			addressDetail,
		});
	});
});
