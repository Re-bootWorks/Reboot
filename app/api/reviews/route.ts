import { NextRequest, NextResponse } from "next/server";
import { getReviews } from "@/features/reviews/apis/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	try {
		const result = await getReviews(searchParams);

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
