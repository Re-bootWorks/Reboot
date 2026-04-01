import { serverFetch } from "@/libs/serverFetch";
import { nextJsonResponse } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

// 알림 삭제
export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ notificationId: string }> },
) {
	try {
		const { notificationId } = await params;
		const res = await serverFetch(`/notifications/${notificationId}`, {
			method: "DELETE",
		});

		return nextJsonResponse(res);
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
