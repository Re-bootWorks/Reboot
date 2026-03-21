import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PageIntro from ".";

const meta = {
	title: "ui/PageIntro",
	component: PageIntro,
	tags: ["autodocs"],
	parameters: {
		nextjs: {
			appDirectory: true,
		},
	},
} satisfies Meta<typeof PageIntro>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reviews: Story = {
	parameters: {
		nextjs: {
			appDirectory: true,
			navigation: {
				pathname: "/reviews",
			},
		},
	},
};

export const Favorites: Story = {
	parameters: {
		nextjs: {
			appDirectory: true,
			navigation: {
				pathname: "/favorites",
			},
		},
	},
};

export const Posts: Story = {
	parameters: {
		nextjs: {
			appDirectory: true,
			navigation: {
				pathname: "/posts",
			},
		},
	},
};
