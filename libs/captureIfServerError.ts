import * as Sentry from "@sentry/nextjs";

/**
 * 5xx 서버 에러만 Sentry로 캡쳐
 * 기존 에러 처리 흐름 변경 x, response는 그대로 반환
 * */
export default function captureIfServerError(response: Response, endPoint: string, method: string) {
	if (response.status >= 500 && response.status < 600) {
		Sentry.captureException(new Error(`${response.status}: ${endPoint}`), {
			tags: {
				endPoint,
				status: String(response.status),
				method: method.toUpperCase(),
			},
		});
	}
}
