import { mapCommentToCard } from "./mappers";
import type { PostComment } from "@/features/connect/post/types";

const baseComment: PostComment = {
	id: 10,
	content: "좋은 글이에요!",
	createdAt: "2024-02-01T12:00:00.000Z",
	author: {
		id: 99,
		name: "김댓글",
		image: "https://example.com/avatar.jpg",
	},
};

describe("mapCommentToCard", () => {
	describe("기본 필드 매핑", () => {
		it("id, content가 올바르게 매핑된다", () => {
			const result = mapCommentToCard(baseComment);

			expect(result.id).toBe(10);
			expect(result.content).toBe("좋은 글이에요!");
		});

		it("author.name이 authorName으로 매핑된다", () => {
			const result = mapCommentToCard(baseComment);

			expect(result.authorName).toBe("김댓글");
		});
	});

	describe("authorImage 매핑", () => {
		it("author.image가 있으면 authorImage로 매핑된다", () => {
			const result = mapCommentToCard(baseComment);

			expect(result.authorImage).toBe("https://example.com/avatar.jpg");
		});

		it("author.image가 없으면 authorImage가 undefined다", () => {
			const commentWithoutImage: PostComment = {
				...baseComment,
				author: { id: 99, name: "김댓글" },
			};
			const result = mapCommentToCard(commentWithoutImage);

			expect(result.authorImage).toBeUndefined();
		});
	});

	describe("createdAt → date 변환", () => {
		it("createdAt 문자열이 timestamp(number)로 변환된다", () => {
			const result = mapCommentToCard(baseComment);

			expect(typeof result.date).toBe("number");
			expect(result.date).toBe(new Date("2024-02-01T12:00:00.000Z").getTime());
		});

		it("date가 문자열이 아닌 숫자 타입이다", () => {
			const result = mapCommentToCard(baseComment);

			expect(result.date).not.toBe("2024-02-01T12:00:00.000Z");
		});
	});
});
