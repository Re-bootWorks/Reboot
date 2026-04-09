import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

interface RouteParams {
	params: Promise<{ meetingId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
	const { meetingId } = await params;

	const cursor = req.nextUrl.searchParams.get("cursor");
	const queryParams = new URLSearchParams();
	if (cursor) queryParams.append("cursor", cursor);
	try {
		const response = await serverFetch(
			`/meetings/${meetingId}/participants${queryParams.toString() ? `?${queryParams}` : ""}`,
		);

		const data = await response.json().catch(() => null);
		return NextResponse.json(data, { status: response.status });
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
