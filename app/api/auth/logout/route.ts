import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverFetch } from "@/libs/serverFetch";
import { COOKIE_OPTIONS } from "@/constants/auth";

export async function POST() {
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
			const res = NextResponse.json(data, { status: response.status });
			res.cookies.delete({ name: "accessToken", ...COOKIE_OPTIONS });
			res.cookies.delete({ name: "refreshToken", ...COOKIE_OPTIONS });
			return res;
		}

		const res = NextResponse.json({ message: "로그아웃 성공" }, { status: 200 });

		res.cookies.delete({ name: "accessToken", ...COOKIE_OPTIONS });
		res.cookies.delete({ name: "refreshToken", ...COOKIE_OPTIONS });

		return res;
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
