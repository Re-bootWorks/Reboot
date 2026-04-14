import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	const presignedUrl = request.headers.get("x-presigned-url");
	if (!presignedUrl) {
		return NextResponse.json({ message: "Missing x-presigned-url header" }, { status: 400 });
	}

	const contentType = request.headers.get("content-type");
	if (!contentType) {
		return NextResponse.json({ message: "Missing content-type header" }, { status: 400 });
	}

	const body = await request.arrayBuffer();
	const response = await fetch(presignedUrl, {
		method: "PUT",
		headers: { "Content-Type": contentType },
		body: body,
	});

	if (!response.ok) {
		// 서버 에러 응답이 XML 형식이기 때문에 상태 코드로 분기 처리
		if (response.status >= 500) {
			return NextResponse.json(
				{ message: "서버에 일시적인 문제가 발생했습니다." },
				{ status: response.status },
			);
		}
		if (response.status >= 400) {
			return NextResponse.json({ message: "잘못된 요청입니다." }, { status: response.status });
		}
	}

	return NextResponse.json({ success: true });
}
