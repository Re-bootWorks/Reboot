import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import GroupCard from ".";

const meta: Meta<typeof GroupCard> = {
	title: "UI/GroupCard",
	component: GroupCard,
	subcomponents: {
		Skeleton: GroupCard.Skeleton,
		Image: GroupCard.Image,
		Content: GroupCard.Content,
		Title: GroupCard.Title,
		SubTitle: GroupCard.SubTitle,
		BadgeGroup: GroupCard.BadgeGroup,
		ParticipantBar: GroupCard.ParticipantBar,
		JoinButton: GroupCard.JoinButton,
		LikeButton: GroupCard.LikeButton,
	},
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	args: {
		id: 1,
		href: "#",
		status: {
			isConfirmed: false,
			isRegClosed: false,
			isLiked: false,
			isJoined: false,
		},
	},
	argTypes: {
		id: { control: false },
		href: { control: false },
		children: { control: false },
		status: { control: "object" },
	},
	decorators: [(Story) => <Story />],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		status: {
			isConfirmed: true,
			isRegClosed: false,
			isLiked: false,
			isJoined: false,
		},
	},
	render: renderPreview("https://placehold.co/80x80"),
};

export const RegistrationClosed: Story = {
	args: {
		status: {
			isConfirmed: true,
			isRegClosed: true,
			isLiked: false,
			isJoined: false,
		},
	},
	render: renderPreview("https://placehold.co/80x80"),
};

export const Loading: Story = {
	render: () => <GroupCard.Skeleton />,
};

export const NoImage: Story = {
	args: {
		status: {
			isConfirmed: true,
			isRegClosed: false,
			isLiked: false,
			isJoined: false,
		},
	},
	render: renderPreview(),
};

function renderPreview(src?: string | null): NonNullable<Story["render"]> {
	return function Preview(...[args]) {
		const [isPending, setIsPending] = useState({ join: false, like: false });
		const [isLiked, setIsLiked] = useState(args.status.isLiked);
		const [isJoined, setIsJoined] = useState(args.status.isJoined);

		const status = { ...args.status, isLiked, isJoined };

		return (
			<GroupCard {...args} status={status}>
				<GroupCard.Image src={src} alt="오피스 스트레칭" />
				<GroupCard.Content>
					<GroupCard.Title name="오피스 스트레칭" />
					<GroupCard.SubTitle region="을지로 3가" type="운동/건강" />
					<GroupCard.BadgeGroup date="1월 7일" time="17:30" deadlineText="오늘 21시 마감" />
					<GroupCard.ParticipantBar capacity={20} participantCount={12} />
					<GroupCard.JoinButton
						isPending={isPending.join}
						onClick={async () => {
							setIsPending((prev) => ({ ...prev, join: true }));
							await new Promise((resolve) => setTimeout(resolve, 200));
							setIsJoined((prev) => !prev);
							setIsPending((prev) => ({ ...prev, join: false }));
						}}
					/>
					<GroupCard.LikeButton
						isPending={isPending.like}
						onClick={async () => {
							setIsPending((prev) => ({ ...prev, like: true }));
							await new Promise((resolve) => setTimeout(resolve, 200));
							setIsLiked((prev) => !prev);
							setIsPending((prev) => ({ ...prev, like: false }));
						}}
					/>
				</GroupCard.Content>
			</GroupCard>
		);
	};
}
