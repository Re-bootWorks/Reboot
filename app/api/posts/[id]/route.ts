import { NextRequest, NextResponse } from "next/server";
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

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const res = await serverFetch(`/posts/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			return NextResponse.json({ message: "삭제 실패" }, { status: res.status });
		}

		return NextResponse.json({ message: "삭제 성공" }, { status: 200 });
	} catch {
		return NextResponse.json({ message: "서버 에러" }, { status: 500 });
	}
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const body = await req.json();

		const res = await serverFetch(`/posts/${params.id}`, {
			method: "PATCH",
			body: JSON.stringify(body),
		});

		if (!res.ok) {
			throw new Error("게시글 수정 실패");
		}

		const data = await res.json();

		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ message: "수정 실패" }, { status: 500 });
	}
}
