import { NextRequest, NextResponse } from "next/server";
import type { ErrorResponse, ErrorResponsePresigned } from "@/apis/images";
import { serverFetch } from "@/libs/serverFetch";

const DEFAULT_ERROR_PRESIGNED = {
	code: "UNKNOWN_ERROR",
	message: "이미지 업로드 주소 생성에 실패했습니다.",
};
/** 이미지 presigned URL 발급 */
const ROUTE_IMAGES = "/images";
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { fileName, contentType, folder } = body;

		const response = await serverFetch(ROUTE_IMAGES, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ fileName, contentType, folder }),
		});

		if (!response.ok) {
			const error: ErrorResponse | ErrorResponsePresigned = await response
				.json()
				.catch(() => DEFAULT_ERROR_PRESIGNED);
			const message =
				"error" in error
					? error.error.name === "ZodError"
						? "파일 형식이 올바르지 않습니다."
						: error.error.message
					: error.message;
			return NextResponse.json({ message }, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
