import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE, COOKIE_OPTIONS } from "@/constants/auth";

export async function POST(request: NextRequest) {
	try {
		const { accessToken, refreshToken } = await request.json();

		if (!accessToken || !refreshToken) {
			return NextResponse.json(
				{ message: "accessToken과 refreshToken이 필요합니다." },
				{ status: 400 },
			);
		}

		const res = NextResponse.json({ success: true }, { status: 200 });

		res.cookies.set("accessToken", accessToken, {
			...COOKIE_OPTIONS,
			maxAge: ACCESS_TOKEN_MAX_AGE,
		});

		res.cookies.set("refreshToken", refreshToken, {
			...COOKIE_OPTIONS,
			maxAge: REFRESH_TOKEN_MAX_AGE,
		});

		return res;
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
