import { NextRequest, NextResponse } from "next/server";
import { getReviews } from "@/features/reviews/apis/server";
import type { ReviewsSortBy, ReviewsSortOrder } from "@/features/reviews/types";

function isReviewsSortBy(value: string | null): value is ReviewsSortBy {
	return value === "dateTime" || value === "registrationEnd" || value === "participantCount";
}

function isReviewsSortOrder(value: string | null): value is ReviewsSortOrder {
	return value === "asc" || value === "desc";
}

function toOptionalNumber(value: string | null): number | undefined {
	if (!value) return undefined;

	const numberValue = Number(value);
	return Number.isNaN(numberValue) ? undefined : numberValue;
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	const sort = searchParams.get("sort");
	const order = searchParams.get("order");

	try {
		const result = await getReviews({
			type: searchParams.get("type") ?? undefined,
			region: searchParams.get("region") ?? undefined,
			date: searchParams.get("date") ?? undefined,
			sortBy: isReviewsSortBy(sort) ? sort : undefined,
			sortOrder: isReviewsSortOrder(order) ? order : undefined,
			cursor: searchParams.get("cursor") ?? undefined,
			size: toOptionalNumber(searchParams.get("size")),
		});

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
