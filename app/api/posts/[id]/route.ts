import { NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const res = await serverFetch(`/posts/${id}`);
		const data = await res.json();

		return NextResponse.json(data, { status: res.status });
	} catch {
		return NextResponse.json({ message: "게시글 조회 실패" }, { status: 500 });
	}
}
