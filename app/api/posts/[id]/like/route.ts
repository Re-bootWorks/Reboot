import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params;
		const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

		const res = await serverFetch(`/${TEAM_ID}/posts/${id}/like`, {
			method: "POST",
		});

		if (!res.ok) {
			return NextResponse.json({ message: "좋아요 실패" }, { status: res.status });
		}

		return NextResponse.json({ message: "좋아요 성공" }, { status: 200 });
	} catch {
		return NextResponse.json({ message: "서버 에러" }, { status: 500 });
	}
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params;
		const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

		const res = await serverFetch(`/${TEAM_ID}/posts/${id}/like`, {
			method: "DELETE",
		});

		if (!res.ok) {
			return NextResponse.json({ message: "좋아요 취소 실패" }, { status: res.status });
		}

		return NextResponse.json({ message: "좋아요 취소 성공" }, { status: 200 });
	} catch {
		return NextResponse.json({ message: "서버 에러" }, { status: 500 });
	}
}
