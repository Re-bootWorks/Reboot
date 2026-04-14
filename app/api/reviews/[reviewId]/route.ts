import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";
import { nextJsonResponse } from "@/utils/api.server";

// 모임 리뷰 수정하기
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ reviewId: string }> },
) {
	let body;

	try {
		body = await request.json();
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "잘못된 요청 입니다." }, { status: 400 });
	}

	try {
		const { reviewId } = await params;

		const res = await serverFetch(`/reviews/${reviewId}`, {
			method: "PATCH",
			body: JSON.stringify(body),
		});

		return nextJsonResponse(res);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ reviewId: string }> },
) {
	try {
		const { reviewId } = await params;
		const res = await serverFetch(`/reviews/${reviewId}`, {
			method: "DELETE",
		});

		return nextJsonResponse(res);
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
