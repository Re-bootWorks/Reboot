import { REGION_DATA } from "@/constants/region";
import type { Option } from "@/components/ui/Filter/RegionFilter/option";
import type { FavoriteSortBy, FavoriteSortOrder } from "./types";
import { FAVORITES_SORT_BY_OPTIONS, FAVORITES_SORT_ORDER_OPTIONS } from "./constants/filers";

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

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_START_SUFFIX = "T00:00:00+09:00";
const DATE_END_SUFFIX = "T23:59:59+09:00";

export function toDateTimeRangeStart(value?: string | null): string | undefined {
	if (!value) return undefined;
	if (value.includes("T")) return value;
	if (DATE_ONLY_REGEX.test(value)) return `${value}${DATE_START_SUFFIX}`;
	return value;
}

export function toDateTimeRangeEnd(value?: string | null): string | undefined {
	if (!value) return undefined;
	if (value.includes("T")) return value;
	if (DATE_ONLY_REGEX.test(value)) return `${value}${DATE_END_SUFFIX}`;
	return value;
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

/** 상태 코드별 찜 목록 에러 메시지 반환 */
export function getFavoritesErrorMessage(status: number) {
	switch (status) {
		case 400:
			return "잘못된 요청입니다";
		case 401:
			return "인증이 필요합니다";
		case 404:
			return "요청한 찜 목록을 찾을 수 없습니다";
		default:
			return "찜 목록 조회에 실패했습니다";
	}
}

export function isFavoriteSortBy(value: string | null): value is FavoriteSortBy {
	return (
		value === "createdAt" ||
		value === "meetingCreatedAt" ||
		value === "dateTime" ||
		value === "registrationEnd" ||
		value === "participantCount"
	);
}

export function isFavoriteSortOrder(value: string | null): value is FavoriteSortOrder {
	return value === "asc" || value === "desc";
}

export function toOptionalNumber(value: string | null): number | undefined {
	if (!value) return undefined;

	const numberValue = Number(value);
	return Number.isNaN(numberValue) ? undefined : numberValue;
}

/** 정렬 기준 항목 조회 */
export function getSortByItem(param: string | null) {
	return FAVORITES_SORT_BY_OPTIONS.find((o) => o.value === param) ?? FAVORITES_SORT_BY_OPTIONS[0];
}

/** 정렬 순서 항목 조회 */
export function getSortOrderItem(param: string | null) {
	return (
		FAVORITES_SORT_ORDER_OPTIONS.find((o) => o.value === param) ?? FAVORITES_SORT_ORDER_OPTIONS[0]
	);
}
