import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverFetch } from "@/libs/serverFetch";

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
			return NextResponse.json(data, { status: response.status });
		}

		const res = NextResponse.json({ message: "로그아웃 성공" }, { status: 200 });

		res.cookies.set("accessToken", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 0,
			path: "/",
		});

		res.cookies.set("refreshToken", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 0,
			path: "/",
		});

		return res;
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
