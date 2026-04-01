import { NextResponse } from "next/server";
import { getReviewsStatistics } from "@/features/reviews/apis/server";

export async function GET() {
	try {
		const result = await getReviewsStatistics();

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
