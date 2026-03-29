import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

const ROUTE_MEETINGS = "/meetings";

/** 모임 목록 조회 */
export async function GET(request: NextRequest) {
	const queryParams = request.nextUrl.searchParams.toString();

	try {
		const response = await serverFetch(`${ROUTE_MEETINGS}?${queryParams}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
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

/** 모임 생성 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const response = await serverFetch(ROUTE_MEETINGS, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
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
