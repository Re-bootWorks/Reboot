import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ReviewCard from ".";
import { mockMyReviews, mockUserProfile } from "@/features/mypage/mockData";

const meta: Meta<typeof ReviewCard> = {
	title: "Features/My/ReviewCard",
	component: ReviewCard,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	decorators: [
		(Story) => (
			<div className="bg-white p-6">
				<ul>
					<Story />
				</ul>
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof ReviewCard>;

export const Default: Story = {
	args: {
		user: mockUserProfile,
		item: mockMyReviews[0],
		handleEdit: () => {},
		handleDelete: () => {},
	},
};

export const EmptyThumbnail: Story = {
	args: {
		user: mockUserProfile,
		item: mockMyReviews[1],
		handleEdit: () => {},
		handleDelete: () => {},
	},
};

export const AllStates: Story = {
	render: () => (
		<div className="space-y-6">
			{mockMyReviews.map((reviewItem) => (
				<ReviewCard
					key={reviewItem.id}
					user={mockUserProfile}
					item={reviewItem}
					handleEdit={() => {}}
					handleDelete={() => {}}
				/>
			))}
		</div>
	),
};
