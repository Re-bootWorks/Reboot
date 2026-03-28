// 백엔드 응답이 비어 있거나 JSON이 아닐 수 있어 안전하게 파싱

export async function parseJsonSafely(response: Response) {
	try {
		return await response.json();
	} catch {
		return null;
	}
}
