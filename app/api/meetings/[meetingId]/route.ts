import { serverFetch } from "@/libs/serverFetch";
import { nextJsonResponse } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ meetingId: string }> },
) {
	try {
		const { meetingId } = await params;
		const res = await serverFetch(`/meetings/${meetingId}`, {
			method: "DELETE",
		});

		return nextJsonResponse(res);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
