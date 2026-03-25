import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const response = await serverFetch("/auth/signup", {
			method: "POST",
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
