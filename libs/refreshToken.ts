"use server";
import { cookies } from "next/headers";

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

	const cookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict" as const,
		path: "/",
	};

	cookieStore.set("accessToken", newAccessToken, { ...cookieOptions, maxAge: 60 * 15 });
	cookieStore.set("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 7 });

	return newAccessToken;
}
