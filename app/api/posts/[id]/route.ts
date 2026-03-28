import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

// GET
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const res = await serverFetch(`/posts/${id}`);
		const data = await res.json();

		return NextResponse.json(data, { status: res.status });
	} catch (error) {
		console.error("GET ERROR:", error);
		return NextResponse.json({ message: "게시글 조회 실패" }, { status: 500 });
	}
}

// POST
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
	} catch (error) {
		console.error("POST ERROR:", error);
		return NextResponse.json({ message: "댓글 생성 실패" }, { status: 500 });
	}
}
