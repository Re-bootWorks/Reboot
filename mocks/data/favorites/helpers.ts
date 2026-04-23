import type {
	FavoriteMeeting,
	FavoritesListRequest,
	FavoritesListResponse,
} from "@/features/favorites/types";

const SORT_ORDER_VALUES = new Set<string>(["asc", "desc"]);

type FavoriteListSortKey = NonNullable<FavoritesListRequest["sortBy"]>;

const FAVORITE_LIST_SORT_KEYS = new Set<FavoriteListSortKey>([
	"createdAt",
	"meetingCreatedAt",
	"dateTime",
	"registrationEnd",
	"participantCount",
]);

function toTimestamp(value: string): number | null {
	const timestamp = new Date(value).getTime();
	return Number.isFinite(timestamp) ? timestamp : null;
}

export function parseFavoritesListRequest(url: URL): FavoritesListRequest {
	const num = (key: string): number | undefined => {
		const value = url.searchParams.get(key);
		if (value == null || value === "") return undefined;

		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : undefined;
	};

	const str = (key: string): string | undefined => {
		const value = url.searchParams.get(key);
		return value != null && value !== "" ? value : undefined;
	};

	return {
		type: str("type"),
		region: str("region"),
		dateStart: str("dateStart"),
		dateEnd: str("dateEnd"),
		sortBy: str("sortBy") as FavoritesListRequest["sortBy"],
		sortOrder: str("sortOrder") as FavoritesListRequest["sortOrder"],
		cursor: str("cursor"),
		size: num("size"),
	};
}

export function buildFavoritesListResponse(
	rows: readonly FavoriteMeeting[],
	params: FavoritesListRequest = {},
): FavoritesListResponse {
	let list = [...rows];

	if (params.type) {
		list = list.filter((favorite) => favorite.meeting.type === params.type);
	}

	if (params.region) {
		const needle = params.region.trim();
		list = list.filter(
			(favorite) =>
				favorite.meeting.region.includes(needle) || needle.includes(favorite.meeting.region),
		);
	}

	if (params.dateStart) {
		const dateStart = new Date(params.dateStart).getTime();
		if (Number.isFinite(dateStart)) {
			list = list.filter((favorite) => {
				const meetingTime = toTimestamp(favorite.meeting.dateTime);
				return meetingTime == null || meetingTime >= dateStart;
			});
		}
	}

	if (params.dateEnd) {
		const dateEnd = new Date(params.dateEnd).getTime();
		if (Number.isFinite(dateEnd)) {
			list = list.filter((favorite) => {
				const meetingTime = toTimestamp(favorite.meeting.dateTime);
				return meetingTime == null || meetingTime <= dateEnd;
			});
		}
	}

	const sortKeyRaw = params.sortBy;
	const sortBy: FavoriteListSortKey =
		sortKeyRaw && FAVORITE_LIST_SORT_KEYS.has(sortKeyRaw) ? sortKeyRaw : "createdAt";
	const sortOrder =
		params.sortOrder && SORT_ORDER_VALUES.has(params.sortOrder) ? params.sortOrder : "desc";
	const direction = sortOrder === "desc" ? -1 : 1;

	list.sort((a, b) => {
		let aValue: number;
		let bValue: number;

		if (sortBy === "meetingCreatedAt") {
			aValue = toTimestamp(a.meeting.createdAt) ?? 0;
			bValue = toTimestamp(b.meeting.createdAt) ?? 0;
		} else if (sortBy === "dateTime") {
			aValue = toTimestamp(a.meeting.dateTime) ?? 0;
			bValue = toTimestamp(b.meeting.dateTime) ?? 0;
		} else if (sortBy === "registrationEnd") {
			aValue = toTimestamp(a.meeting.registrationEnd) ?? 0;
			bValue = toTimestamp(b.meeting.registrationEnd) ?? 0;
		} else if (sortBy === "participantCount") {
			aValue = a.meeting.participantCount;
			bValue = b.meeting.participantCount;
		} else {
			aValue = toTimestamp(a.createdAt) ?? 0;
			bValue = toTimestamp(b.createdAt) ?? 0;
		}

		if (aValue === bValue) return a.id - b.id;
		return (aValue - bValue) * direction;
	});

	const limit = params.size != null && params.size > 0 ? Math.min(params.size, 100) : 10;
	let offset = 0;

	if (params.cursor != null && params.cursor !== "") {
		const parsedCursor = Number(params.cursor);
		if (Number.isFinite(parsedCursor) && parsedCursor >= 0) {
			offset = Math.floor(parsedCursor);
		}
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
