import { NextResponse } from "next/server";

const KAKAO_CLIENT_ID = process.env.KAKAO_REST_API_KEY!;
const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI!;

export async function GET() {
	const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
	return NextResponse.redirect(kakaoAuthUrl);
}
