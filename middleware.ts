import { NextRequest, NextResponse } from "next/server";

// 로그인 필요한 페이지
const PROTECTED_ROUTES = [
	"/mypage",
	"/connect/create",
	"/connect/edit",
	"/meetup/create",
	"/favorites",
];

// 로그인한 유저가 접근하면 홈으로 리다이렉트
const AUTH_ROUTES = ["/login", "/signup", "/oauth"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const refreshToken = request.cookies.get("refreshToken")?.value;

	// 로그인 한 유저가 진입시 -> 홈으로 리다이렉트
	if (AUTH_ROUTES.some((route) => pathname.startsWith(route)) && refreshToken) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// 인증되지 않은 유저가 인증이 필요한 URL로 진입시 -> 로그인페이지로이동
	if (
		(PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) ||
			(pathname.startsWith("/meetup/") &&
				pathname
					.split("/")
					.filter((p) => p)
					.pop() === "edit")) &&
		!refreshToken
	) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
	if (pathname === "/meetup/create") {
		const step = request.nextUrl.searchParams.get("step");
		const validStep = Number(step);

		// step 외 다른 쿼리 있거나, step이 숫자가 아니거나 범위 밖이면 리다이렉트
		if (!step || isNaN(validStep) || validStep < 1 || validStep > 4) {
			return NextResponse.redirect(new URL("/meetup/create?step=1", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * 다음으로 시작하는 경로를 제외한 모든 요청 경로를 매칭합니다:
		 * - api (API 라우트)
		 * - _next/static (정적 파일)
		 * - _next/image (이미지 최적화 파일)
		 * - favicon.ico (파비콘 파일)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
