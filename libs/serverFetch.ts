import { cookies } from "next/headers";
import { refreshToken } from "./refreshToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 싱글턴: 진짜 동시 요청이 올 경우 refresh 중복 실행 방지
// 캐시: 순차 실행으로 싱글턴이 의미없을 경우, 완료된 refresh 결과 재활용
const refreshTokenPromiseMap = new Map<string, Promise<string | null>>();
const cachedTokenMap = new Map<string, { value: string; refreshedAt: number }>();
const CACHE_TTL = 15_000; // 15초: 한 페이지 로드 내 모든 API 요청을 커버하는 시간

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

	// 이 key로 아래 Map들을 조회
	const cacheKey = accessToken || "guest";

	const response = await fetchWithToken(endpoint, options, accessToken);

	if (response.status !== 401) {
		return response;
	}

	// 해당 유저의 캐시된 토큰 확인
	const cached = cachedTokenMap.get(cacheKey);

	// 캐시된 토큰이 있고 CACHE_TTL 이내면 새로 refresh 하지 않고 캐시된 토큰으로 재시도
	if (cached && Date.now() - cached.refreshedAt < CACHE_TTL) {
		return fetchWithToken(endpoint, options, cached.value);
	}

	//  해당 유저에 대한 리프레시가 진행 중인지 확인
	// refresh 진행 중이 아니면 refresh + cache 설정 , 진행 중이면 같은 Promise 대기
	if (!refreshTokenPromiseMap.has(cacheKey)) {
		const promise = refreshToken()
			.then((token) => {
				if (token) {
					cachedTokenMap.set(cacheKey, { value: token, refreshedAt: Date.now() });

					// 💡 메모리 누수 방지: 10초 뒤 해당 유저의 캐시만 삭제
					setTimeout(() => {
						cachedTokenMap.delete(cacheKey);
					}, CACHE_TTL);
				}
				return token;
			})
			.finally(() => {
				// 리프레시 종료 후 프로미스 맵에서 삭제
				refreshTokenPromiseMap.delete(cacheKey);
			});

		refreshTokenPromiseMap.set(cacheKey, promise);
	}

	const promise = refreshTokenPromiseMap.get(cacheKey);
	const newAccessToken = promise ? await promise : null;

	// refresh 실패 시 원래 401 응답 반환
	if (!newAccessToken) return response;

	// 새 토큰으로 원래 요청 재시도
	return fetchWithToken(endpoint, options, newAccessToken);
}
