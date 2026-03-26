const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export async function uploadImage(file: File) {
	// presigned URL 요청
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_TEAM_ID}/images`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				fileName: file.name,
				contentType: file.type,
				folder: "posts",
			}),
		},
	);

	const { presignedUrl, publicUrl } = await res.json();

	// S3 업로드
	await fetch(presignedUrl, {
		method: "PUT",
		body: file,
		headers: {
			"Content-Type": file.type,
		},
	});

	// public URL 반환
	return publicUrl;
}
