import { REGION_DATA } from "@/constants/region";
import { Option } from "@/components/ui/Filter/RegionFilter/option";
import { ReviewsSortBy, ReviewsSortOrder } from "./types";

export interface RegionFilterValue {
	region: Option | null;
	district: Option | null;
	fullLabel: string;
}

export function getRegionItem(param: string | null): RegionFilterValue {
	if (!param) {
		return { region: null, district: null, fullLabel: "" };
	}

	const [regionLabel, districtLabel] = param.split(" ");
	const regionData = REGION_DATA.find((r) => r.label === regionLabel);

	if (!regionData) {
		return { region: null, district: null, fullLabel: "" };
	}

	const region: Option = {
		label: regionData.label,
		value: regionData.label,
	};

	const district = regionData.districts.find((d) => d.label === districtLabel) ?? null;

	return {
		region,
		district,
		fullLabel: district ? `${region.label} ${district.label}` : region.label,
	};
}

export function buildRegionParam(region: Option | null, district: Option | null) {
	if (!region || !district) {
		return null;
	}

	return `${region.label} ${district.label}`;
}

/** 객체를 API 요청 쿼리 스트링 문자열 만들기 */
export function buildQuery(params: Record<string, string | number | undefined | null>) {
	const queryParams = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		queryParams.append(key, String(value));
	}
	return queryParams.toString();
}

/** 상태 코드별 리뷰 목록 에러 메시지 반환 */
export function getErrorMessage(status: number) {
	switch (status) {
		case 400:
			return "잘못된 요청입니다";
		case 401:
			return "인증이 필요합니다";
		case 404:
			return "요청한 정보를 찾을 수 없습니다";
		default:
			return "조회 실패";
	}
}

export function isReviewsSortBy(value: string | null): value is ReviewsSortBy {
	return value === "dateTime" || value === "registrationEnd" || value === "participantCount";
}

export function isReviewsSortOrder(value: string | null): value is ReviewsSortOrder {
	return value === "asc" || value === "desc";
}

export function toOptionalNumber(value: string | null): number | undefined {
	if (!value) return undefined;

	const numberValue = Number(value);
	return Number.isNaN(numberValue) ? undefined : numberValue;
}
