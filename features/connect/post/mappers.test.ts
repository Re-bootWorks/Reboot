import { mapPostToCard } from "./mappers";
import type { Post } from "./types";

const basePost: Post = {
	id: 1,
	title: "테스트 게시글",
	content: "<p>안녕하세요</p>",
	image: "https://example.com/image.jpg",
	likeCount: 10,
	createdAt: "2024-01-15T09:00:00.000Z",
	author: { name: "홍길동" },
	_count: { comments: 5 },
};

describe("mapPostToCard", () => {
	describe("기본 필드 매핑", () => {
		it("id, title, likeCount, commentCount가 올바르게 매핑된다", () => {
			const result = mapPostToCard(basePost);

			expect(result.id).toBe(1);
			expect(result.title).toBe("테스트 게시글");
			expect(result.likeCount).toBe(10);
			expect(result.commentCount).toBe(5);
		});

		it("author.name이 올바르게 매핑된다", () => {
			const result = mapPostToCard(basePost);

			expect(result.author.name).toBe("홍길동");
		});
	});

	describe("description - HTML 태그 제거", () => {
		it("<p> 태그가 제거된 순수 텍스트가 description이 된다", () => {
			const result = mapPostToCard({ ...basePost, content: "<p>안녕하세요</p>" });

			expect(result.description).toBe("안녕하세요");
		});

		it("중첩 태그도 모두 제거된다", () => {
			const result = mapPostToCard({
				...basePost,
				content: "<div><h1>제목</h1><p>본문 내용</p></div>",
			});

			expect(result.description).toBe("제목본문 내용");
		});

		it("태그가 없는 순수 텍스트는 그대로 반환된다", () => {
			const result = mapPostToCard({ ...basePost, content: "태그 없는 텍스트" });

			expect(result.description).toBe("태그 없는 텍스트");
		});
	});

	describe("imageUrl 매핑", () => {
		it("image 필드가 있으면 imageUrl로 그대로 사용된다", () => {
			const result = mapPostToCard({
				...basePost,
				image: "https://direct.com/photo.jpg",
				content: '<img src="https://content.com/photo.jpg" />',
			});

			expect(result.imageUrl).toBe("https://direct.com/photo.jpg");
		});

		it("image가 null이면 content의 <img src>에서 URL을 추출한다", () => {
			const result = mapPostToCard({
				...basePost,
				image: null as unknown as string,
				content: '<p>내용</p><img src="https://content.com/photo.jpg" />',
			});

			expect(result.imageUrl).toBe("https://content.com/photo.jpg");
		});

		it("image도 null이고 content에 img도 없으면 imageUrl이 null이다", () => {
			const result = mapPostToCard({
				...basePost,
				image: null as unknown as string,
				content: "<p>이미지 없는 글</p>",
			});

			expect(result.imageUrl).toBeNull();
		});
	});

	describe("createdAt → date 변환", () => {
		it("createdAt 문자열이 timestamp(number)로 변환된다", () => {
			const result = mapPostToCard(basePost);

			expect(typeof result.date).toBe("number");
			expect(result.date).toBe(new Date("2024-01-15T09:00:00.000Z").getTime());
		});

		it("date가 문자열이 아닌 숫자 타입이다", () => {
			const result = mapPostToCard(basePost);

			expect(result.date).not.toBe("2024-01-15T09:00:00.000Z");
		});
	});
});
