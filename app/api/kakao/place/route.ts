import { NextRequest, NextResponse } from "next/server";

const KAKAO_PLACE_API_URL = process.env.KAKAO_PLACE_API_URL;
const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

if (!KAKAO_PLACE_API_URL) {
	throw new Error("KAKAO_PLACE_API_URL이 설정되지 않았습니다.");
}
if (!KAKAO_REST_API_KEY) {
	throw new Error("KAKAO_REST_API_KEY이 설정되지 않았습니다.");
}

/** 카카오 장소 검색 */
export async function GET(request: NextRequest) {
	try {
		const query = request.nextUrl.searchParams.get("query");
		const response = await fetch(`${KAKAO_PLACE_API_URL}?query=${query}`, {
			headers: {
				Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorBody = await response.json().catch(() => null);
			return NextResponse.json(errorBody, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
