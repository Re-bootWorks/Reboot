// 백엔드 응답 body 안전하게 파싱
export async function parseJsonSafely(response: Response) {
	try {
		return await response.json();
	} catch {
		return null;
	}
}
