import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/libs/serverFetch";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE, COOKIE_OPTIONS } from "@/constants/auth";

const KAKAO_CLIENT_ID = process.env.KAKAO_REST_API_KEY!;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET!;
const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI!;

export async function GET(request: NextRequest) {
	try {
		const code = request.nextUrl.searchParams.get("code");

		if (!code) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		// 1. 콜백 페이지에서 인가 코드 → 토큰 교환
		const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "authorization_code",
				client_id: KAKAO_CLIENT_ID,
				client_secret: KAKAO_CLIENT_SECRET,
				code,
				redirect_uri: REDIRECT_URI,
			}),
		});

		const tokenData = await tokenRes.json();
		console.log("tokenData:", tokenData);
		const { access_token } = tokenData;

		// 2. 받은 토큰을 백엔드로 전달
		const response = await serverFetch("/oauth/kakao", {
			method: "POST",
			body: JSON.stringify({ token: access_token }),
		});

		let data;
		try {
			data = await response.json();
		} catch (e) {
			console.error("kakao callback error:", e);
			return NextResponse.redirect(new URL("/login", request.url));
		}

		if (!response.ok) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		const { accessToken, refreshToken } = data;

		const res = NextResponse.redirect(new URL("/meetup/list", request.url));

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
		return NextResponse.redirect(new URL("/login", request.url));
	}
}
