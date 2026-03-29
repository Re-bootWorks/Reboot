import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";
import { nextJsonResponse } from "@/utils/api";

// 찜 추가
export async function POST(
	_request: NextRequest,
	{ params }: { params: Promise<{ meetingId: string }> },
) {
	try {
		const { meetingId } = await params;
		const res = await serverFetch(`/meetings/${meetingId}/favorites`, {
			method: "POST",
		});

		return nextJsonResponse(res);
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}

// 찜 해제
export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ meetingId: string }> },
) {
	try {
		const { meetingId } = await params;
		const res = await serverFetch(`/meetings/${meetingId}/favorites`, {
			method: "DELETE",
		});

		return nextJsonResponse(res);
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
