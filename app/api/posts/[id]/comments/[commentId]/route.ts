import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string; commentId: string }> },
) {
	try {
		const { id, commentId } = await params;
		const body = await req.json();

		const res = await serverFetch(`/posts/${id}/comments/${commentId}`, {
			method: "PATCH",
			body: JSON.stringify(body),
		});

		const data = await res.json();

		return NextResponse.json(data, { status: res.status });
	} catch {
		return NextResponse.json({ message: "댓글 수정 실패" }, { status: 500 });
	}
}

export async function DELETE(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string; commentId: string }> },
) {
	try {
		const { id, commentId } = await params;

		const res = await serverFetch(`/posts/${id}/comments/${commentId}`, {
			method: "DELETE",
		});

		const data = await res.json();
		return NextResponse.json(data, { status: res.status });
	} catch {
		return NextResponse.json({ message: "댓글 삭제 실패" }, { status: 500 });
	}
}
