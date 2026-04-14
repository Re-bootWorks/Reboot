import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Banner from ".";

const meta = {
	title: "Features/Meetup/List/Banner",
	component: Banner,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		// viewport 이슈를 위한 설정
		docs: {
			story: {
				inline: false,
				iframeHeight: 280,
			},
		},
	},
	decorators: [(Story) => <Story />],
} satisfies Meta<typeof Banner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
