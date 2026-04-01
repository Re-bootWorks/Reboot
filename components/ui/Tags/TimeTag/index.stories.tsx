import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TimeTag } from "./index";

const meta: Meta<typeof TimeTag> = {
	title: "UI/Tags/TimeTag",
	component: TimeTag,
	tags: ["autodocs"],
	argTypes: {
		size: {
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

type Story = StoryObj<typeof TimeTag>;

export const Time: Story = {
	args: { size: "sm", children: "17:30" },
};

export const Date: Story = {
	args: { size: "sm", children: "1월 7일" },
};
