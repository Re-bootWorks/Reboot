import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SocialButton from "./index";

const meta: Meta<typeof SocialButton> = {
	title: "Buttons/SocialButton",
	component: SocialButton,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		social: {
			control: "radio",
			options: ["Kakao", "Google"],
		},
	},
};

export default meta;

type Story = StoryObj<typeof SocialButton>;

export const Kakao: Story = {
	args: {
		social: "Kakao",
		children: "카카오로 시작하기",
	},
};

export const Google: Story = {
	args: {
		social: "Google",
		children: "구글로 시작하기",
	},
};
