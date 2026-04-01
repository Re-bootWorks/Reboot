import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

interface RouteParams {
	params: Promise<{ meetingId: string }>;
}

const getRoute = (meetingId: string) => `/meetings/${meetingId}`;

/** 모임 조회 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
	const { meetingId } = await params;
	try {
		const response = await serverFetch(getRoute(meetingId));
		const data = await response.json().catch(() => null);
		return NextResponse.json(data, { status: response.status });
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}

/** 모임 수정 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
	const { meetingId } = await params;
	try {
		const body = await request.json();
		const response = await serverFetch(getRoute(meetingId), {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		const data = await response.json().catch(() => null);

		return NextResponse.json(data, { status: response.status });
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}

/** 모임 삭제 */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
	const { meetingId } = await params;
	try {
		const response = await serverFetch(getRoute(meetingId), { method: "DELETE" });
		const data = await response.json().catch(() => null);
		return NextResponse.json(data, { status: response.status });
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
