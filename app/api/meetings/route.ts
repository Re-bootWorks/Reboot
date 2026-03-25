import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

/** 모임 생성 */
const ROUTE_MEETINGS = "/meetings";
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const response = await serverFetch(ROUTE_MEETINGS, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const error = await response.json().catch(() => null);
			return NextResponse.json(error, { status: error.status });
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
