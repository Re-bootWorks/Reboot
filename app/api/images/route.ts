import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";
import { parseJsonSafely } from "@/libs/api";

export async function POST(request: NextRequest) {
	let req;

	try {
		req = await request.json();
	} catch {
		// 요청 body 자체가 잘못된 경우
		return NextResponse.json({ message: "잘못된 요청 입니다." }, { status: 400 });
	}

	try {
		// 실제 엔드포인트
		const res = await serverFetch("/images", {
			method: "POST",
			body: JSON.stringify(req),
		});

		// 백엔드 응답 body 안전하게 파싱
		const data = await parseJsonSafely(res);

		return NextResponse.json(data, { status: res.status });
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
