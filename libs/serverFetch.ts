import { cookies } from "next/headers";
import { refreshToken } from "./refreshToken";

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
		return response;
	}

	const newAccessToken = await refreshToken();

	if (!newAccessToken) return response;

	return fetchWithToken(endpoint, options, newAccessToken);
}
