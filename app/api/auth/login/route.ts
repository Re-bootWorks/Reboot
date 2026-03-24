import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const response = await serverFetch("/auth/login", {
			method: "POST",
			body: JSON.stringify(body),
		});

		let data;
		try {
			data = await response.json();
		} catch {
			data = null;
		}

		if (!response.ok) {
			return NextResponse.json(data, { status: response.status });
		}

		const { accessToken, refreshToken, user } = data;

		const res = NextResponse.json({ user }, { status: 200 });

		res.cookies.set("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 15,
			path: "/",
		});

		res.cookies.set("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 7,
			path: "/",
		});

		return res;
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
