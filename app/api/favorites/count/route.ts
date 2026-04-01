import { serverFetch } from "@/libs/serverFetch";
import { parseJsonSafely } from "@/utils/api";
import { NextResponse } from "next/server";

// GNB 찜한 모임 개수
export async function GET() {
	try {
		const res = await serverFetch("/favorites/count");
		const data = await parseJsonSafely(res);

		return NextResponse.json(data, { status: res.status });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
