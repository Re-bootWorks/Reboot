import { serverFetch } from "@/libs/serverFetch";
import { NextRequest, NextResponse } from "next/server";

/** 이미지 presigned URL 발급 */
const ROUTE_IMAGES = "/images";
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { fileName, contentType, folder } = body;

		const response = await serverFetch(ROUTE_IMAGES, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ fileName, contentType, folder }),
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
