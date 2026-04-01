"use server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE, COOKIE_OPTIONS } from "@/constants/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function refreshToken(): Promise<string | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get("refreshToken")?.value;

	if (!token) return null;

	let response: Response;
	try {
		response = await fetch(`${API_URL}/auth/refresh`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refreshToken: token }),
		});
	} catch {
		return null;
	}

	if (!response.ok) {
		cookieStore.delete("accessToken");
		cookieStore.delete("refreshToken");
		return null;
	}

	let data: { accessToken: string; refreshToken: string };
	try {
		data = await response.json();
	} catch {
		return null;
	}

	const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;

	if (!newAccessToken || !newRefreshToken) return null;

	cookieStore.set("accessToken", newAccessToken, {
		...COOKIE_OPTIONS,
		maxAge: ACCESS_TOKEN_MAX_AGE,
	});
	cookieStore.set("refreshToken", newRefreshToken, {
		...COOKIE_OPTIONS,
		maxAge: REFRESH_TOKEN_MAX_AGE,
	});

	return newAccessToken;
}
