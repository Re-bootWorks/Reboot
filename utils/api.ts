import { NextResponse } from "next/server";
interface ErrorResponse {
	code?: string;
	message?: string;
}

// 백엔드 응답이 비어 있거나 JSON이 아닐 수 있어 안전하게 파싱
export async function parseJsonSafely(response: Response) {
	try {
		return await response.json();
	} catch {
		return null;
	}
}

export async function nextJsonResponse(response: Response) {
	const data = await parseJsonSafely(response);
	return NextResponse.json(data, { status: response.status });
}

/**
 * API 응답이 실패한 경우 에러 바디의 message를 우선 읽어 throw합니다
 *
 * JSON 파싱이 불가능하거나 message가 없는 응답이면 fallbackMessage를 사용합니다
 *
 * @param response fetch response 객체
 * @param fallbackMessage 응답 바디를 읽을 수 없을 때 사용할 기본 에러 메시지
 * @throws {Error} API 실패 응답의 메시지 또는 fallbackMessage
 *
 * @example
 * const res = await clientFetch("/users/me", {
 *   method: "PATCH",
 *   body: JSON.stringify(payload),
 * });
 *
 * await throwErrorMessage(res, "프로필 수정에 실패했습니다.");
 * return res.json();
 */
export async function throwApiError(response: Response, fallbackMessage: string): Promise<void> {
	if (response.ok) return;

	const error: ErrorResponse = await response.json().catch(() => ({
		message: fallbackMessage,
	}));

	throw new Error(error.message ?? fallbackMessage);
}
