import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";
import { nextJsonResponse } from "@/utils/api.server";

// 내가 작성한 리뷰 목록
export async function GET(request: NextRequest) {
	try {
		const endpoint = `/users/me/reviews${request.nextUrl.search}`;

		const res = await serverFetch(endpoint);
		return nextJsonResponse(res);
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
