import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CompactCard from "./index";
import Container from "@/components/layout/Container";
import dayjs from "@/libs/dayjs";

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

export const WithImage: Story = {
	args: {
		id: 1,
		title: "주말 러닝 모임 같이 하실 분",
		image: "https://picsum.photos/300/200",
		createdAt: dayjs().subtract(2, "hour").toISOString(),
		likeCount: 8,
		commentCount: 3,
	},
	render: (args) => (
		<Container>
			<div className="flex gap-4">
				<CompactCard {...args} />
				<CompactCard {...args} />
			</div>
		</Container>
	),
};

export const WithoutImage: Story = {
	args: {
		id: 1,
		title: "주말 러닝 모임 같이 하실 분",
		image: "",
		createdAt: dayjs().subtract(2, "hour").toISOString(),
		likeCount: 8,
		commentCount: 3,
	},
	render: (args) => (
		<Container>
			<div className="flex gap-4">
				<CompactCard {...args} />
				<CompactCard {...args} />
			</div>
		</Container>
	),
};

export const AllCases: Story = {
	render: () => (
		<Container>
			<div className="flex gap-4">
				<CompactCard
					id={1}
					title="방금 생성된 글"
					image="https://picsum.photos/300/200"
					createdAt={dayjs().toISOString()}
					likeCount={1}
					commentCount={0}
				/>

				<CompactCard
					id={2}
					title="1시간 전 글"
					image=""
					createdAt={dayjs().subtract(1, "hour").toISOString()}
					likeCount={5}
					commentCount={2}
				/>

				<CompactCard
					id={3}
					title="1일 전 글"
					image="https://picsum.photos/300/200"
					createdAt={dayjs().subtract(1, "day").toISOString()}
					likeCount={12}
					commentCount={4}
				/>
			</div>
		</Container>
	),
};
