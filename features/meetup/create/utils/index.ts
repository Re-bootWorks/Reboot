/** 지역 추출 (서울 강남구) */
export const getRegion = (first: string, second: string) => {
	return `${first} ${second}`;
};

/** 도로명 주소 통합 */
export const getAddress = (name: string, detail: string) => {
	return `${name}, ${detail}`;
};
