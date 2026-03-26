export async function createPost(data: { title: string; content: string; imageUrl: string }) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_TEAM_ID}/posts`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		},
	);

	if (!res.ok) throw new Error("게시글 생성 실패");

	return res.json();
}
