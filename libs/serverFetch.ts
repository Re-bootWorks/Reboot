import { cookies } from "next/headers";
import { refreshToken } from "./refreshToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 싱글턴: 진짜 동시 요청이 올 경우 refresh 중복 실행 방지
// 캐시: 순차 실행으로 싱글턴이 의미없을 경우, 완료된 refresh 결과 재활용
let refreshTokenPromise: Promise<string | null> | null = null;
let cachedToken: { value: string; refreshedAt: number } | null = null;
const CACHE_TTL = 10_000; // 10초: 한 페이지 로드 내 모든 API 요청을 커버하는 시간

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

	// 캐시된 토큰이 있고 CACHE_TTL 이내면 새로 refresh 하지 않고 캐시된 토큰으로 재시도
	if (cachedToken && Date.now() - cachedToken.refreshedAt < CACHE_TTL) {
		return fetchWithToken(endpoint, options, cachedToken.value);
	}

	// refresh 진행 중이 아니면 refresh + cache 설정 , 진행 중이면 같은 Promise 대기
	if (!refreshTokenPromise) {
		refreshTokenPromise = refreshToken()
			.then((token) => {
				if (token) cachedToken = { value: token, refreshedAt: Date.now() };
				return token;
			})
			.finally(() => {
				refreshTokenPromise = null;
			});
	}

	const newAccessToken = await refreshTokenPromise;

	// refresh 실패 시 원래 401 응답 반환
	if (!newAccessToken) return response;

	// 새 토큰으로 원래 요청 재시도
	return fetchWithToken(endpoint, options, newAccessToken);
}
