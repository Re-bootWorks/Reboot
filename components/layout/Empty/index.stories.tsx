import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Empty from ".";

const meta: Meta<typeof Empty> = {
	title: "Layout/Empty",
	component: Empty,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: "모임이 비어있을 때 보여주는 Empty 컴포넌트",
			},
		},
	},

	argTypes: {
		section: {
			control: { type: "boolean" },
			description: "빈 페이지 or 빈 섹션 중 활용 가능",
		},
		className: {
			description: "Custom Style",
		},

		children: {
			control: false,
			description: "페이지별 컨텐츠 삽입",
		},
	},
};
export default meta;

type Story = StoryObj<typeof Empty>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: "페이지 별로 부모 컴포넌트(태그)에서 높이 조절 후 해당 컴포넌트 삽입",
			},
		},
	},
	render: (args) => (
		<div className="h-[50vh] bg-gray-50 p-20">
			<Empty {...args}>
				아직 모임이 없어요
				<br />
				지금 바로 모임을 만들어보세요!
			</Empty>
		</div>
	),
};

export const Section: Story = {
	args: {
		section: true,
	},
	parameters: {
		docs: {
			description: {
				story: "모든 리뷰에서 사용",
			},
		},
	},
	render: (args) => (
		<div className="bg-gray-50 p-20">
			<Empty {...args}>아직 리뷰가 없어요</Empty>
		</div>
	),
};
