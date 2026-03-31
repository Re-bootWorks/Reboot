import { cookies } from "next/headers";
import { refreshToken } from "./refreshToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 현재 요청 안에서 공유되는 refresh Promise (사용자들끼리 섞이지 않도록)
const refreshMap = new Map<string, Promise<string | null>>();

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
	const refreshTokenValue = cookieStore.get("refreshToken")?.value;

	const response = await fetchWithToken(endpoint, options, accessToken);

	// 정상 응답이면 그대로 반환
	if (response.status !== 401) {
		return response;
	}

	// refreshToken이 없으면 그대로 401 반환
	if (!refreshTokenValue) {
		return response;
	}

	// refresh 진행 중이면 그 Promise 재사용
	if (!refreshMap.has(refreshTokenValue)) {
		const refreshPromise = refreshToken().finally(() => {
			setTimeout(() => refreshMap.delete(refreshTokenValue), 10_000);
		});

		refreshMap.set(refreshTokenValue, refreshPromise);
	}

	const newAccessToken = await refreshMap.get(refreshTokenValue);

	// refresh 실패 시 원래 401 응답 반환
	if (!newAccessToken) {
		return response;
	}

	// 새 토큰으로 원래 요청 재시도
	return fetchWithToken(endpoint, options, newAccessToken);
}
