import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	// 예: /api/posts?category=free&page=1 에서 쿼리스트링 추출

	const query = searchParams.toString();
	// → "category=free&page=1" 문자열로 변환

	const res = await serverFetch(`/posts?${query}`);
	// 백엔드에 /posts?category=free&page=1 로 요청

	if (!res.ok) {
		const errorText = await res.text();

		return new NextResponse(errorText, {
			status: res.status,
			statusText: res.statusText,
		});
	}
	// 실패 먼저 처리

	const data = await res.json();

	return NextResponse.json(data, { status: res.status });
	// 백엔드 응답 그대로 클라이언트에 전달
}
