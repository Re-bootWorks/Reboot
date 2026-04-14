import type {
	ReviewsListItem,
	ReviewsListRequest,
	ReviewsListResponse,
} from "@/features/reviews/types";
import { MEETINGS } from "../meetings/fixtures";

const SORT_ORDER_VALUES = new Set<string>(["asc", "desc"]);

type ReviewListSortKey =
	| "createdAt"
	| "score"
	| "dateTime"
	| "registrationEnd"
	| "participantCount";

const REVIEW_LIST_SORT_KEYS = new Set<string>([
	"createdAt",
	"score",
	"dateTime",
	"registrationEnd",
	"participantCount",
]);

function meetingRow(meetingId: number) {
	return MEETINGS.data.find((m) => m.id === meetingId);
}

function meetingDateMs(review: ReviewsListItem): number | null {
	const t = new Date(review.meeting.dateTime).getTime();
	return Number.isFinite(t) ? t : null;
}

function registrationEndMs(meetingId: number): number | null {
	const m = meetingRow(meetingId);
	if (!m) return null;
	const t = new Date(m.registrationEnd).getTime();
	return Number.isFinite(t) ? t : null;
}

/** GET /reviews 쿼리 → 요청 객체 */
export function parseReviewsListRequest(url: URL): ReviewsListRequest {
	const num = (key: string): number | undefined => {
		const v = url.searchParams.get(key);
		if (v == null || v === "") return undefined;
		const n = Number(v);
		return Number.isFinite(n) ? n : undefined;
	};
	const str = (key: string): string | undefined => {
		const v = url.searchParams.get(key);
		return v != null && v !== "" ? v : undefined;
	};
	return {
		type: str("type"),
		region: str("region"),
		dateStart: str("dateStart"),
		dateEnd: str("dateEnd"),
		registrationEndStart: str("registrationEndStart"),
		registrationEndEnd: str("registrationEndEnd"),
		sortBy: str("sortBy") as ReviewsListRequest["sortBy"],
		sortOrder: str("sortOrder") as ReviewsListRequest["sortOrder"],
		cursor: str("cursor"),
		size: num("size"),
	};
}

/** 리뷰 배열에 필터·정렬·페이지네이션 적용 */
export function buildReviewsListResponse(
	rows: readonly ReviewsListItem[],
	params: ReviewsListRequest = {},
): ReviewsListResponse {
	let list = [...rows];

	if (params.type) {
		list = list.filter((r) => r.meeting.type === params.type);
	}
	if (params.region) {
		const needle = params.region.trim();
		list = list.filter(
			(r) => r.meeting.region.includes(needle) || needle.includes(r.meeting.region),
		);
	}
	if (params.dateStart) {
		const t = new Date(params.dateStart).getTime();
		if (Number.isFinite(t)) {
			list = list.filter((r) => {
				const mt = meetingDateMs(r);
				return mt == null || mt >= t;
			});
		}
	}
	if (params.dateEnd) {
		const t = new Date(params.dateEnd).getTime();
		if (Number.isFinite(t)) {
			list = list.filter((r) => {
				const mt = meetingDateMs(r);
				return mt == null || mt <= t;
			});
		}
	}
	if (params.registrationEndStart) {
		const t = new Date(params.registrationEndStart).getTime();
		if (Number.isFinite(t)) {
			list = list.filter((r) => {
				const reg = registrationEndMs(r.meetingId);
				return reg == null || reg >= t;
			});
		}
	}
	if (params.registrationEndEnd) {
		const t = new Date(params.registrationEndEnd).getTime();
		if (Number.isFinite(t)) {
			list = list.filter((r) => {
				const reg = registrationEndMs(r.meetingId);
				return reg == null || reg <= t;
			});
		}
	}

	const sortKeyRaw = params.sortBy as string | undefined;
	const sortBy: ReviewListSortKey =
		sortKeyRaw && REVIEW_LIST_SORT_KEYS.has(sortKeyRaw)
			? (sortKeyRaw as ReviewListSortKey)
			: "createdAt";
	const sortOrder =
		params.sortOrder && SORT_ORDER_VALUES.has(params.sortOrder) ? params.sortOrder : "desc";
	const dir = sortOrder === "desc" ? -1 : 1;

	list.sort((a, b) => {
		let av: number;
		let bv: number;
		if (sortBy === "score") {
			av = a.score;
			bv = b.score;
		} else if (sortBy === "participantCount") {
			av = meetingRow(a.meetingId)?.participantCount ?? 0;
			bv = meetingRow(b.meetingId)?.participantCount ?? 0;
		} else if (sortBy === "registrationEnd") {
			av = registrationEndMs(a.meetingId) ?? 0;
			bv = registrationEndMs(b.meetingId) ?? 0;
		} else if (sortBy === "dateTime") {
			av = meetingDateMs(a) ?? 0;
			bv = meetingDateMs(b) ?? 0;
		} else {
			av = new Date(a.createdAt).getTime();
			bv = new Date(b.createdAt).getTime();
		}
		if (av === bv) return a.id - b.id;
		return (av - bv) * dir;
	});

	const limit = params.size != null && params.size > 0 ? Math.min(params.size, 100) : 10;
	let offset = 0;
	if (params.cursor != null && params.cursor !== "") {
		const parsed = Number(params.cursor);
		if (Number.isFinite(parsed) && parsed >= 0) offset = Math.floor(parsed);
	}
	const pageRows = list.slice(offset, offset + limit);
	const nextOffset = offset + pageRows.length;
	const hasMore = nextOffset < list.length;

	return {
		data: pageRows,
		nextCursor: hasMore ? String(nextOffset) : null,
		hasMore,
	};
}
