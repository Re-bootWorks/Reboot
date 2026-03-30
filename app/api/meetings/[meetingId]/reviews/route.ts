import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";
import { nextJsonResponse } from "@/utils/api";

// 모임 리뷰 작성하기

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ meetingId: string }> },
) {
	let body;

	try {
		body = await request.json();
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "잘못된 요청 입니다." }, { status: 400 });
	}

	try {
		const { meetingId } = await params;

		const res = await serverFetch(`/meetings/${meetingId}/reviews`, {
			method: "POST",
			body: JSON.stringify(body),
		});

		return nextJsonResponse(res);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
