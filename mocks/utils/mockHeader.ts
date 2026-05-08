jest.mock("next/headers", () => ({
	cookies: jest.fn(),
}));

import { cookies } from "next/headers";

export type MockCookieStore = Awaited<ReturnType<typeof cookies>>;

/**
 * 서버 API 테스트에서 `next/headers`의 `cookies()`를 일관되게 mock 하기 위한 유틸.
 * access/refresh token 유무를 제어해 `serverFetch`가 읽는 쿠키 상태를 재현한다.
 */
export const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;

export function createCookieStore(tokens: { accessToken?: string; refreshToken?: string } = {}) {
	return {
		get: jest.fn((name: string) => {
			if (name === "accessToken" && tokens.accessToken) {
				return { name, value: tokens.accessToken };
			}

			if (name === "refreshToken" && tokens.refreshToken) {
				return { name, value: tokens.refreshToken };
			}

			return undefined;
		}),
		set: jest.fn(),
		delete: jest.fn(),
	} as unknown as MockCookieStore;
}
