import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE, COOKIE_OPTIONS } from "@/constants/auth";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ provider: string }> },
) {
	try {
		const { provider } = await params;
		const body = await request.json();

		const response = await serverFetch(`/oauth/${provider}`, {
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
