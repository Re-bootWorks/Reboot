import { NextResponse } from "next/server";
import { parseJsonSafely } from "./api";

export async function nextJsonResponse(response: Response) {
	const data = await parseJsonSafely(response);
	return NextResponse.json(data, { status: response.status });
}
