import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

interface RouteParams {
	params: Promise<{ meetingId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	const { meetingId } = await params;
	const queryParams = request.nextUrl.searchParams.toString();
	try {
		const response = await serverFetch(
			`/meetings/${meetingId}/reviews${queryParams ? `?${queryParams}` : ""}`,
		);
		const data = await response.json().catch(() => null);
		return NextResponse.json(data, { status: response.status });
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
