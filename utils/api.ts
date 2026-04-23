interface ApiErrorParams {
	message: string;
	status: number;
	code?: string;
	fallbackMessage?: string;
}

interface ThrowApiErrorOptions {
	statusMessages?: Partial<Record<number, string>>;
}

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

/**
 * API 응답이 실패한 경우 에러 바디의 message를 우선 읽어 throw합니다
 *
 * JSON 파싱이 불가능하거나 message가 없는 응답이면 fallbackMessage를 사용합니다
 *
 * @param response fetch response 객체
 * @param fallbackMessage 응답 바디를 읽을 수 없을 때 사용할 기본 에러 메시지
 * @param options 특정 HTTP status에 대해 서버 message보다 우선 사용할 메시지 옵션
 * @throws {ApiError} API 실패 응답의 메시지, 상태코드, 에러코드를 담은 에러
 *
 * @example
 * const res = await clientFetch(...);
 *
 * await throwApiError(res, "모임 삭제에 실패했습니다.", {
 *   statusMessages: {
 *     404: "이미 삭제된 모임입니다.",
 *   },
 * });
 * return res.json();
 *
 * 1. statusMessages에 해당 status가 있으면 그 문구 노출
 * 2. 서버가 message 내려주면 그 문구 노출
 * 3. 서버 message 없으면 throwApiError에 넣은 폴백 문구 노출
 * onError: (error: Error) => {
 *  handleShowToast({
 *   message: error.message,
 *   status: "error",
 *  });
 * }
 */
export async function throwApiError(
	response: Response,
	fallbackMessage: string,
	options: ThrowApiErrorOptions = {},
): Promise<void> {
	if (response.ok) return;

	// 응답 실패시 null
	const data = await response.json().catch(() => null);
	const statusMessage = options.statusMessages?.[response.status];

	throw new ApiError({
		message: statusMessage ?? data?.message ?? fallbackMessage,
		status: response.status,
		code: data?.code,
		fallbackMessage,
	});
}

/**
 * 사용자에게 보여줄 에러 메시지를 안전하게 추출합니다.
 *
 * throwApiError를 사용한 API 에러 처리 외에도
 * throwApiError를 사용하지 않았거나 에러 형태가 일정하지 않을 때 사용할 수 있습니다.
 *
 * @param error onError 등에서 전달받은 알 수 없는 에러 객체
 * @param fallback error에서 메시지를 꺼낼 수 없을 때 사용할 기본 문구
 *
 *
 * @example
 * 일반 Error를 직접 throw한 경우
 * try {
 *   throw new Error("이미지 업로드에 실패했습니다.");
 * } catch (error) {
 *   const message = getUserErrorMessage(error, "알 수 없는 오류가 발생했습니다.");
 * }
 *
 * @example
 * 문자열이나 예상치 못한 값이 넘어온 경우 fallback 사용
 * const message = getUserErrorMessage("network error", "잠시 후 다시 시도해주세요.");
 */
export function getUserErrorMessage(error: unknown, fallback: string) {
	if (error instanceof Error) {
		return error.message || fallback;
	}
	return fallback;
}

// 백엔드 응답이 비어 있거나 JSON이 아닐 수 있어 안전하게 파싱
export async function parseJsonSafely(response: Response) {
	try {
		return await response.json();
	} catch {
		return null;
	}
}
