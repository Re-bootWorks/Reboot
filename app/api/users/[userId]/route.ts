import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

/**
 * 유저 공개 프로필 조회
 * GET /api/users/[userId]
 *
 * 인증 없이 접근 가능합니다.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
	const { userId } = await params;
	const res = await serverFetch(`/users/${userId}`);
	const data = await res.json();

	if (!res.ok) {
		return NextResponse.json(data, { status: res.status });
	}

	return NextResponse.json(data);
}
