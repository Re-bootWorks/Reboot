import { serverFetch } from "@/libs/serverFetch";
import { nextJsonResponse } from "@/utils/api.server";
import { NextResponse } from "next/server";

// GNB 찜한 모임 개수
export async function GET() {
	try {
		const res = await serverFetch("/favorites/count");
		return nextJsonResponse(res);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
