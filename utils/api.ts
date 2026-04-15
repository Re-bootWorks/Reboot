interface ApiErrorParams {
	message: string;
	status: number;
	code?: string;
	fallbackMessage?: string;
}

/**
 * API 응답이 실패한 경우 에러 바디의 message를 우선 읽어 throw합니다
 *
 * JSON 파싱이 불가능하거나 message가 없는 응답이면 fallbackMessage를 사용합니다
 *
 * @param response fetch response 객체
 * @param fallbackMessage 응답 바디를 읽을 수 없을 때 사용할 기본 에러 메시지
 * @throws {ApiError} API 실패 응답의 메시지, 상태코드, 에러코드를 담은 에러
 *
 * @example
 * const res = await clientFetch("/users/me", {
 *   method: "PATCH",
 *   body: JSON.stringify(payload),
 * });
 *
 * await throwApiError(res, "프로필 수정에 실패했습니다.");
 * return res.json();
 */

// 기본 Error를 확장한 커스텀 에러 클래스
export class ApiError extends Error {
	status: number; // HTTP 상태코드
	code?: string; // 백엔드가 내려주는 에러 코드
	fallbackMessage?: string; // 폴백용 기본메세지

	constructor({ message, status, code, fallbackMessage }: ApiErrorParams) {
		super(message); // Error 호출
		this.name = "ApiError"; // 디버깅 용이하도록 이름 명시
		this.status = status;
		this.code = code;
		this.fallbackMessage = fallbackMessage;
	}
}

export async function throwApiError(response: Response, fallbackMessage: string): Promise<void> {
	if (response.ok) return;

	// 응답 실패시 null
	const data = await response.json().catch(() => null);

	throw new ApiError({
		message: data?.message ?? fallbackMessage,
		status: response.status,
		code: data?.code,
		fallbackMessage,
	});
}

// 백엔드 응답이 비어 있거나 JSON이 아닐 수 있어 안전하게 파싱
export async function parseJsonSafely(response: Response) {
	try {
		return await response.json();
	} catch {
		return null;
	}
}

export function getUserErrorMessage(error: unknown, fallback: string) {
	if (error instanceof Error) {
		return error.message || fallback;
	}
	return fallback;
}
