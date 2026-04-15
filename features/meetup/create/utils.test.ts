import type { MeetupCreateFormData } from "./providers/FormDataProvider";
import { extractMeetupData } from "./utils";

describe("모임 생성 요청 데이터 추출 함수 테스트", () => {
	const data: MeetupCreateFormData = {
		name: "JS 스터디",
		type: "자기계발",
		region: "서울 강남구",
		address: "", // 계산되는 값
		latitude: 37.503354516625,
		longitude: 127.049874752633,
		dateTime: "", // 계산되는 값
		registrationEnd: "", // 계산되는 값
		capacity: 6,
		image: "https://example.com/image.jpg",
		description: "JS 같이 공부해요!",
		_dateTime: {
			date: "2026-04-30",
			time: "09:00",
		},
		_registrationEnd: {
			date: "2026-04-17",
			time: "18:00",
		},
		_addressName: "서울 강남구 대치동 889-41",
		_addressDetail: "위워크 선릉 3호점",
	};
	const expected = {
		name: "JS 스터디",
		type: "자기계발",
		region: "서울 강남구",
		address: "서울 강남구 대치동 889-41, 위워크 선릉 3호점",
		latitude: 37.503354516625,
		longitude: 127.049874752633,
		dateTime: "2026-04-30T00:00:00.000Z",
		registrationEnd: "2026-04-17T09:00:00.000Z",
		capacity: 6,
		image: "https://example.com/image.jpg",
		description: "JS 같이 공부해요!",
	};

	test("모임 생성 폼 데이터가 요청 데이터 형식으로 올바르게 변환되어야 함", () => {
		const result = extractMeetupData(data);

		expect(result).not.toHaveProperty("_dateTime");
		expect(result).not.toHaveProperty("_registrationEnd");
		expect(result).not.toHaveProperty("_addressName");
		expect(result).not.toHaveProperty("_addressDetail");
		expect(result).toStrictEqual(expected);
	});
});
