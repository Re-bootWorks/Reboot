import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Container from ".";

const meta: Meta<typeof Container> = {
	title: "Layout/Container",
	component: Container,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: "페이지의 최대 너비 제한을 위한 컴포넌트",
			},
		},
	},
	args: {
		as: "section",
		narrow: false,
	},
	argTypes: {
		as: {
			control: { type: "select" },
			options: ["section", "div", "main", "article", "aside"],
			description: "Container의 Tag 설정",
		},
		narrow: {
			control: { type: "boolean" },
			description: "Container의 너비",
		},
		className: {
			description: "Container의 Custom Style",
		},

		children: {
			control: false,
		},
	},
};
export default meta;

type Story = StoryObj<typeof Container>;

export const Default: Story = {
	render: (args) => (
		<Container {...args}>
			<div className="w-full rounded-md bg-gray-100 p-6 text-gray-700">Container</div>
		</Container>
	),
};

export const Narrow: Story = {
	args: {
		narrow: true,
	},
	render: (args) => (
		<Container {...args}>
			<div className="w-full rounded-md bg-gray-100 p-6 text-gray-700">Narrow container</div>
		</Container>
	),
};
