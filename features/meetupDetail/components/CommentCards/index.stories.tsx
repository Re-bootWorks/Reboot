import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommentCards, { CommentProps } from "./index";
import { ReviewScore } from "@/types/common";

const meta: Meta<typeof CommentCards> = {
	title: "Features/MeetupDetail/CommentCards",
	component: CommentCards,
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CommentCards>;

const mockComments: CommentProps[] = [
	{
		id: 1,
		score: 5,
		comment: "모임이 정말 유익했어요! 다음에도 꼭 참여하고 싶습니다.",
		createdAt: "2026-02-01T20:00:00.000Z",
		user: {
			id: 2,
			name: "김철수",
			image: "/assets/img/img_profile.svg",
		},
	},
	{
		id: 2,
		score: 4,
		comment: "장소가 조금 협소했지만 내용은 알찼습니다.",
		createdAt: "2026-02-02T10:00:00.000Z",
		user: {
			id: 3,
			name: "이영희",
			image: null,
		},
	},
];

export const Default: Story = {
	args: {
		comments: mockComments,
	},
};

export const MixedReviews: Story = {
	name: "내 리뷰 포함 (액션 드롭다운)",
	args: {
		comments: [
			...mockComments,
			{
				id: 3,
				score: 5 as ReviewScore,
				comment: "내가 작성한 리뷰입니다. 수정과 삭제가 가능해요.",
				createdAt: "2026-02-03T15:00:00.000Z",
				user: {
					id: 1, // MOCK_ID와 일치
					name: "나(작성자)",
					image: "/assets/img/img_profile.svg",
				},
			},
		],
	},
};

export const LongComment: Story = {
	name: "긴 코멘트",
	args: {
		comments: [
			{
				id: 4,
				score: 3,
				comment:
					"아주 긴 코멘트가 들어올 경우 어떻게 보이는지 확인하는 예시입니다. 텍스트가 길어질 때 레이아웃이 깨지지 않는지 확인해주세요. 가독성을 위해 줄바꿈이나 패딩이 적절한지 체크합니다. 테스트를 위해 문장을 더 추가해 보겠습니다. 이 리뷰는 화면에서 어떻게 렌더링될까요?",
				createdAt: "2026-02-04T12:00:00.000Z",
				user: {
					id: 4,
					name: "박지민",
					image: null,
				},
			},
		],
	},
};

export const Empty: Story = {
	name: "리뷰 없음",
	args: {
		comments: [],
	},
};
