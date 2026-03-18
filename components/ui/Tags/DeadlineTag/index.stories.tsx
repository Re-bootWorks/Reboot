import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DeadlineTag } from "./index";

const meta: Meta<typeof DeadlineTag> = {
	title: "UI/Tags/DeadlineTag",
	component: DeadlineTag,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md"],
		},
		iconSize: {
			control: "select",
			options: ["sm", "md"],
		},
	},
	parameters: {
		viewport: {
			viewports: {
				sm: {
					name: "sm (mobile)",
					styles: { width: "640px", height: "812px" },
				},
				md: {
					name: "md (tablet)",
					styles: { width: "744px", height: "1024px" },
				},
				lg: {
					name: "lg (desktop)",
					styles: { width: "1280px", height: "800px" },
				},
			},
			defaultViewport: "sm",
		},
	},
};

export default meta;

type Story = StoryObj<typeof DeadlineTag>;

export const Default: Story = {
	args: { size: "sm", children: "오늘 21시 마감" },
};
