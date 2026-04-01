import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PostCreateContainer from "./index";

const meta: Meta<typeof PostCreateContainer> = {
	title: "Connect/PostCreate",
	component: PostCreateContainer,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PostCreateContainer>;

export const Default: Story = {
	render: () => (
		<div className="bg-gray-50 py-10">
			<PostCreateContainer />
		</div>
	),
};
