import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await req.json();

		const res = await serverFetch(`/posts/${id}/comments`, {
			method: "POST",
			body: JSON.stringify(body),
		});

		const data = await res.json();

		return NextResponse.json(data, { status: res.status });
	} catch (_error) {
		return NextResponse.json({ message: "댓글 생성 실패" }, { status: 500 });
	}
}
