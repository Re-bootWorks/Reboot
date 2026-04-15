import type {
	MeetupItem,
	MeetupListRequest,
	MeetupListResponse,
	SortBy,
	SortOrder,
} from "@/features/meetup/types";

const SORT_BY_VALUES = new Set<string>(["dateTime", "registrationEnd", "participantCount"]);
const SORT_ORDER_VALUES = new Set<string>(["asc", "desc"]);

/** GET /meetings 쿼리 → 요청 객체 */
export function parseMeetupListRequest(url: URL): MeetupListRequest {
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
		id: num("id"),
		type: str("type"),
		region: str("region"),
		dateStart: str("dateStart"),
		dateEnd: str("dateEnd"),
		createdBy: num("createdBy"),
		sortBy: str("sortBy") as MeetupListRequest["sortBy"],
		sortOrder: str("sortOrder") as MeetupListRequest["sortOrder"],
		cursor: str("cursor"),
		size: num("size"),
	};
}

/** 모임 배열에 필터·정렬·페이지네이션 적용 */
export function buildMeetupListResponse(
	rows: readonly MeetupItem[],
	params: MeetupListRequest = {},
): MeetupListResponse {
	let list = [...rows];

	if (params.id != null && Number.isFinite(Number(params.id))) {
		list = list.filter((m) => m.id === Number(params.id));
	}
	if (params.type) {
		list = list.filter((m) => m.type === params.type);
	}
	if (params.region) {
		const needle = params.region.trim();
		list = list.filter((m) => m.region.includes(needle) || needle.includes(m.region));
	}
	if (params.dateStart) {
		const t = new Date(params.dateStart).getTime();
		if (!Number.isNaN(t)) list = list.filter((m) => new Date(m.dateTime).getTime() >= t);
	}
	if (params.dateEnd) {
		const t = new Date(params.dateEnd).getTime();
		if (!Number.isNaN(t)) list = list.filter((m) => new Date(m.dateTime).getTime() <= t);
	}
	if (params.createdBy != null && Number.isFinite(Number(params.createdBy))) {
		list = list.filter((m) => m.createdBy === Number(params.createdBy));
	}

	const sortBy: SortBy =
		params.sortBy && SORT_BY_VALUES.has(params.sortBy) ? params.sortBy : "dateTime";
	const sortOrder: SortOrder =
		params.sortOrder && SORT_ORDER_VALUES.has(params.sortOrder) ? params.sortOrder : "asc";
	const dir = sortOrder === "desc" ? -1 : 1;

	list.sort((a, b) => {
		let av: number;
		let bv: number;
		if (sortBy === "registrationEnd") {
			av = new Date(a.registrationEnd).getTime();
			bv = new Date(b.registrationEnd).getTime();
		} else if (sortBy === "participantCount") {
			av = a.participantCount;
			bv = b.participantCount;
		} else {
			av = new Date(a.dateTime).getTime();
			bv = new Date(b.dateTime).getTime();
		}
		if (av === bv) return a.id - b.id;
		return (av - bv) * dir;
	});

	const totalCount = list.length;
	const limit = params.size != null && params.size > 0 ? Math.min(params.size, 100) : 10;
	let offset = 0;
	if (params.cursor != null && params.cursor !== "") {
		const parsed = Number(params.cursor);
		if (Number.isFinite(parsed) && parsed >= 0) offset = Math.floor(parsed);
	}
	const pageRows = list.slice(offset, offset + limit);
	const nextOffset = offset + pageRows.length;
	const hasMore = nextOffset < totalCount;

	return {
		data: pageRows,
		nextCursor: hasMore ? String(nextOffset) : null,
		totalCount,
		currentOffset: offset,
		limit,
		hasMore,
	};
}
