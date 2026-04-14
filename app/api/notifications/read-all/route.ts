import { serverFetch } from "@/libs/serverFetch";
import { NextResponse } from "next/server";
import { nextJsonResponse } from "@/utils/api.server";

// 모든 알림 읽음 처리
export async function PUT() {
	try {
		const res = await serverFetch(`/notifications/read-all`, {
			method: "PUT",
		});

		return nextJsonResponse(res);
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
