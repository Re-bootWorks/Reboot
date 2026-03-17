import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CompactCard from "./index";
import Container from "@/components/layout/Container";

const meta: Meta<typeof CompactCard> = {
	title: "Post/CompactCard",
	component: CompactCard,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
};

export default meta;

type Story = StoryObj<typeof CompactCard>;

export const InContainer: Story = {
	args: {
		id: 1,
		title: "주말 러닝 모임 같이 하실 분",
		image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200",
		createdAt: "2시간 전",
		likeCount: 8,
		commentCount: 3,
	},
	render: (args) => (
		<Container>
			<div className="flex gap-4">
				<CompactCard {...args} />
				<CompactCard {...args} />
				<CompactCard {...args} />
				<CompactCard {...args} />
			</div>
		</Container>
	),
};
