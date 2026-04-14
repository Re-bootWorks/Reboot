import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DetailCard from ".";
import { mockMeetingJoinedApiRes } from "@/features/mypage/mockData";

const baseItem = mockMeetingJoinedApiRes;

const meta: Meta<typeof DetailCard> = {
	title: "Features/My/DetailCard",
	component: DetailCard,
	tags: ["autodocs"],

	decorators: [
		(Story) => (
			<div className="w-full bg-gray-50">
				<ul>
					<Story />
				</ul>
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof DetailCard>;

export const Confirmed: Story = {
	args: {
		item: baseItem,
		badges: [
			{ label: "이용 예정", variant: "scheduled" },
			{ label: "개설확정", variant: "confirmed", showStatusLabel: true },
		],
		actions: [{ label: "예약 취소하기", variant: "purpleBorder", handleCardButtonClick: () => {} }],
		wishAction: { isWished: baseItem.isFavorited, handleWishClick: () => {} },
	},
};

export const Pending: Story = {
	args: {
		item: {
			...baseItem,
			participantCount: 7,
		},
		badges: [
			{ label: "이용 예정", variant: "scheduled" },
			{ label: "개설 대기", variant: "pending" },
		],
		actions: [{ label: "예약 취소하기", variant: "purpleBorder", handleCardButtonClick: () => {} }],
		wishAction: { isWished: baseItem.isFavorited, handleWishClick: () => {} },
	},
};

export const Completed: Story = {
	args: {
		item: {
			...baseItem,
			participantCount: 14,
		},
		badges: [{ label: "이용 완료", variant: "completed" }],
		actions: [{ label: "리뷰 작성하기", variant: "purple", handleCardButtonClick: () => {} }],
		wishAction: { isWished: baseItem.isFavorited, handleWishClick: () => {} },
	},
};

export const Host: Story = {
	args: {
		item: {
			...baseItem,
			participantCount: 20,
		},
		actions: [
			{ label: "모임 확정하기", variant: "purple", handleCardButtonClick: () => {} },
			{
				label: "모임 삭제하기",
				variant: "grayBorder",
				handleCardButtonClick: () => {},
				isDestructive: true,
			},
		],
		wishAction: { isWished: baseItem.isFavorited, handleWishClick: () => {} },
	},
};
export const NoBadgesOrActions: Story = {
	args: {
		item: baseItem,
	},
};
