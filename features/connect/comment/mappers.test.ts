import { mapCommentToCard } from "./mappers";
import type { PostComment } from "@/features/connect/post/types";

const baseComment: PostComment = {
	id: 10,
	content: "좋은 글이에요!",
	createdAt: "2024-02-01T12:00:00.000Z",
	likeCount: 0,
	isLiked: false,
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

		it("반환 객체가 CommentCardItem에 맞는 구조를 가진다", () => {
			const result = mapCommentToCard(baseComment);

			expect(result).toEqual({
				id: 10,
				content: "좋은 글이에요!",
				authorName: "김댓글",
				authorImage: "https://example.com/avatar.jpg",
				date: new Date("2024-02-01T12:00:00.000Z").getTime(),
				likeCount: 0,
				isLiked: false,
			});
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

		it("서로 다른 createdAt은 서로 다른 date를 반환한다", () => {
			const comment1 = { ...baseComment, createdAt: "2024-01-01T00:00:00.000Z" };
			const comment2 = { ...baseComment, createdAt: "2024-06-01T00:00:00.000Z" };

			expect(mapCommentToCard(comment1).date).not.toBe(mapCommentToCard(comment2).date);
		});
	});

	describe("엣지 케이스", () => {
		it("content가 빈 문자열이어도 그대로 매핑된다", () => {
			const result = mapCommentToCard({ ...baseComment, content: "" });

			expect(result.content).toBe("");
		});

		it("content에 특수문자가 있어도 그대로 매핑된다", () => {
			const result = mapCommentToCard({ ...baseComment, content: "<b>굵게</b> & '따옴표'" });

			expect(result.content).toBe("<b>굵게</b> & '따옴표'");
		});

		it("id가 0이어도 올바르게 매핑된다", () => {
			const result = mapCommentToCard({ ...baseComment, id: 0 });

			expect(result.id).toBe(0);
		});
	});
});
