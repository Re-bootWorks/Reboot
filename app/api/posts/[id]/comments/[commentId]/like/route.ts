import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

type Params = Promise<{ id: string; commentId: string }>;

export async function POST(_: NextRequest, { params }: { params: Params }) {
	try {
		const { id, commentId } = await params;

		const res = await serverFetch(`/posts/${id}/comments/${commentId}/like`, {
			method: "POST",
		});

		if (!res.ok) {
			return NextResponse.json({ message: "댓글 좋아요 실패" }, { status: res.status });
		}

		const data = await res.json();
		return NextResponse.json(data, { status: 201 });
	} catch {
		return NextResponse.json({ message: "서버 에러" }, { status: 500 });
	}
}

export async function DELETE(_: NextRequest, { params }: { params: Params }) {
	try {
		const { id, commentId } = await params;

		const res = await serverFetch(`/posts/${id}/comments/${commentId}/like`, {
			method: "DELETE",
		});

		if (!res.ok) {
			return NextResponse.json({ message: "댓글 좋아요 취소 실패" }, { status: res.status });
		}

		return NextResponse.json({ message: "좋아요 취소 성공" }, { status: 200 });
	} catch {
		return NextResponse.json({ message: "서버 에러" }, { status: 500 });
	}
}
