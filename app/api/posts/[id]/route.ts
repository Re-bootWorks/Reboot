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
