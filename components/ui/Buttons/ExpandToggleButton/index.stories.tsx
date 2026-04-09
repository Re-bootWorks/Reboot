import { Meta, StoryObj } from "@storybook/nextjs-vite";
import ExpandToggleButton from ".";

const meta: Meta<typeof ExpandToggleButton> = {
	title: "Buttons/ExpandToggleButton",
	component: ExpandToggleButton,
	tags: ["autodocs"],
	argTypes: {
		isExpanded: {
			control: "boolean",
			description: "버튼의 펼침 상태를 설정",
		},
		onClick: {
			action: "clicked",
			description: "버튼 클릭 이벤트",
		},
		className: {
			control: "text",
			description: "버튼 스타일을 custom 설정",
		},
	},
	args: {
		onClick: () => {},
	},
};

export default meta;

type Story = StoryObj<typeof ExpandToggleButton>;

export const Collapsed: Story = {
	args: {
		isExpanded: false,
	},
};

export const Expanded: Story = {
	args: {
		isExpanded: true,
	},
};
