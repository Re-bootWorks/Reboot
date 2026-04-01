// 알림 목록
import { serverFetch } from "@/libs/serverFetch";
import { nextJsonResponse } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const endpoint = `/notifications${request.nextUrl.search}`;

		const res = await serverFetch(endpoint);
		return nextJsonResponse(res);
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}

// 알림 목록 전체 삭제
export async function DELETE() {
	try {
		const res = await serverFetch(`/notifications`, {
			method: "DELETE",
		});

		return nextJsonResponse(res);
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
