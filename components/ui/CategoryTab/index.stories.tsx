import { Meta, StoryObj } from "@storybook/nextjs-vite";
import CategoryTab from ".";

const meta: Meta<typeof CategoryTab> = {
	title: "UI/CategoryTab",
	component: CategoryTab,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	args: {
		imageSrc: "https://placehold.co/80x80",
		name: "오피스 스트레칭",
	},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
