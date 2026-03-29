import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";
import { nextJsonResponse } from "@/utils/api";

// 내가 작성한 리뷰 목록
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams.toString();
		const endpoint = searchParams ? `/users/me/reviews?${searchParams}` : "/users/me/reviews";

		const res = await serverFetch(endpoint);
		return nextJsonResponse(res);
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
