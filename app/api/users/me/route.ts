import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

export async function GET() {
	try {
		const response = await serverFetch("/users/me");

		let data;
		try {
			data = await response.json();
		} catch {
			data = null;
		}

		if (!response.ok) {
			return NextResponse.json(data, { status: response.status });
		}

		return NextResponse.json(data, { status: response.status });
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const body = await request.json();

		const response = await serverFetch("/users/me", {
			method: "PATCH",
			body: JSON.stringify(body),
		});

		let data;
		try {
			data = await response.json();
		} catch {
			data = null;
		}

		return NextResponse.json(data, { status: response.status });
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
