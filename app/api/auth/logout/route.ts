import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverFetch } from "@/libs/serverFetch";
import { COOKIE_OPTIONS } from "@/constants/auth";

function deleteAuthCookies(res: NextResponse) {
	res.cookies.delete({ name: "accessToken", ...COOKIE_OPTIONS });
	res.cookies.delete({ name: "refreshToken", ...COOKIE_OPTIONS });
}

export async function POST() {
	let body: object = { message: "로그아웃 성공" };
	let status = 200;

	try {
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get("refreshToken")?.value;

		const response = await serverFetch("/auth/logout", {
			method: "POST",
			body: JSON.stringify({ refreshToken }),
		});

		if (!response.ok) {
			let data;
			try {
				data = await response.json();
			} catch {
				data = null;
			}
			body = data;
			status = response.status;
		}
	} catch {
		body = { message: "서버 오류가 발생했습니다." };
		status = 500;
	}

	const res = NextResponse.json(body, { status });
	deleteAuthCookies(res);
	return res;
}
