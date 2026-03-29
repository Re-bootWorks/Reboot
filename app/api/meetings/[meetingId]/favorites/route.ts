import { serverFetch } from "@/libs/serverFetch";
import { NextResponse } from "next/server";

const ROUTE_MEETINGS_FAVORITES = (meetingId: number) => `/meetings/${meetingId}/favorites`;

type Params = Promise<{ meetingId: number }>;

/** 모임 찜 추가 */
export async function POST(_request: Request, { params }: { params: Params }) {
	try {
		const { meetingId } = await params;

		const route = ROUTE_MEETINGS_FAVORITES(meetingId);
		const response = await serverFetch(route, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
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

/** 모임 찜 해제 */
export async function DELETE(_request: Request, { params }: { params: Params }) {
	try {
		const { meetingId } = await params;

		const route = ROUTE_MEETINGS_FAVORITES(meetingId);
		const response = await serverFetch(route, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
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
