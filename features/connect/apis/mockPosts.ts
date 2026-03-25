import type { Post } from "@/features/connect/types";

const now = new Date();

export const mockPosts: Post[] = [
	{
		id: 1,
		title: "힐링 오피스 스트레칭",
		content: "앉아서 할 수 있는 간단 스트레칭 공유합니다.",
		image: "https://picsum.photos/200?random=1",
		likeCount: 12,
		createdAt: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
		author: { name: "김개발" },
		_count: { comments: 3 },
	},
	{
		id: 2,
		title: "요가 입문 후기",
		content: "처음 해봤는데 생각보다 어렵네요 😅",
		image: "https://picsum.photos/200?random=2",
		likeCount: 5,
		createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
		author: { name: "이프론트" },
		_count: { comments: 1 },
	},
	{
		id: 3,
		title: "퇴근 후 20분 루틴",
		content: "헬스장 못가도 집에서 가능한 루틴입니다.",
		image: "https://picsum.photos/200?random=3",
		likeCount: 21,
		createdAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
		author: { name: "박리액트" },
		_count: { comments: 6 },
	},
	{
		id: 4,
		title: "폼롤러 사용법",
		content: "근막 이완 제대로 하는 방법 공유합니다.",
		image: "https://picsum.photos/200?random=4",
		likeCount: 9,
		createdAt: new Date(now.getTime() - 1000 * 60 * 90).toISOString(),
		author: { name: "최운동" },
		_count: { comments: 2 },
	},
	{
		id: 5,
		title: "러닝 시작했습니다",
		content: "3km 뛰었는데 진짜 힘드네요...",
		image: "https://picsum.photos/200?random=5",
		likeCount: 15,
		createdAt: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
		author: { name: "정체력" },
		_count: { comments: 4 },
	},

	//2페이지 (offset 이후 데이터)
	{
		id: 6,
		title: "헬스장 추천 루틴",
		content: "초보자 기준 주 3회 루틴 공유합니다.",
		image: "https://picsum.photos/200?random=6",
		likeCount: 30,
		createdAt: new Date(now.getTime() - 1000 * 60 * 180).toISOString(),
		author: { name: "김트레이너" },
		_count: { comments: 10 },
	},
	{
		id: 7,
		title: "스트레칭 중요성",
		content: "운동보다 더 중요한게 스트레칭입니다.",
		image: "https://picsum.photos/200?random=7",
		likeCount: 18,
		createdAt: new Date(now.getTime() - 1000 * 60 * 240).toISOString(),
		author: { name: "이물리" },
		_count: { comments: 5 },
	},
	{
		id: 8,
		title: "집에서 하는 코어운동",
		content: "플랭크만 제대로 해도 효과 있습니다.",
		image: "https://picsum.photos/200?random=8",
		likeCount: 22,
		createdAt: new Date(now.getTime() - 1000 * 60 * 300).toISOString(),
		author: { name: "박코어" },
		_count: { comments: 7 },
	},
	{
		id: 9,
		title: "다이어트 식단 공유",
		content: "단백질 위주 식단 추천드립니다.",
		image: "https://picsum.photos/200?random=9",
		likeCount: 40,
		createdAt: new Date(now.getTime() - 1000 * 60 * 360).toISOString(),
		author: { name: "최다이어트" },
		_count: { comments: 12 },
	},
	{
		id: 10,
		title: "운동 동기부여 방법",
		content: "꾸준히 하는게 제일 어렵습니다.",
		image: "https://picsum.photos/200?random=10",
		likeCount: 27,
		createdAt: new Date(now.getTime() - 1000 * 60 * 420).toISOString(),
		author: { name: "정멘탈" },
		_count: { comments: 9 },
	},
];

export const getMockPosts = (page: number) => {
	const size = 5;
	const start = (page - 1) * size;
	const end = start + size;

	return {
		data: mockPosts.slice(start, end),
	};
};
