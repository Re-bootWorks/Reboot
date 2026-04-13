import { serverFetch } from "@/libs/serverFetch";
import { NextResponse } from "next/server";
import { nextJsonResponse } from "@/utils/api.server";

// GNB 읽지 않은 알림 개수
export async function GET() {
	try {
		const res = await serverFetch("/notifications/unread-count");
		return nextJsonResponse(res);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
