import { cookies } from "next/headers";
import { refreshToken } from "./refreshToken";
import captureIfServerError from "@/libs/captureIfServerError";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithToken(endpoint: string, options: RequestInit, accessToken?: string) {
	const { headers, ...rest } = options;

	return fetch(`${API_URL}${endpoint}`, {
		headers: {
			"Content-Type": "application/json",
			...(accessToken && { Authorization: `Bearer ${accessToken}` }),
			...headers,
		},
		...rest,
	});
}

export async function serverFetch(endpoint: string, options: RequestInit = {}) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	const response = await fetchWithToken(endpoint, options, accessToken);

	if (response.status !== 401) {
		captureIfServerError(response, endpoint, options.method ?? "GET");
		return response;
	}

	const newAccessToken = await refreshToken();

	if (!newAccessToken) return response;

	const retryResponse = await fetchWithToken(endpoint, options, newAccessToken);
	captureIfServerError(retryResponse, endpoint, options.method ?? "GET");
	return retryResponse;
}
