import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SearchInput from "./index";

const meta: Meta<typeof SearchInput> = {
	title: "UI/SearchInput",
	component: SearchInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "outlined"],
			description: "검색 입력 필드 스타일",
		},
		placeholder: {
			control: "text",
			description: "플레이스홀더 텍스트",
		},
		disabled: {
			control: "boolean",
			description: "비활성화 상태",
		},
	},
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "default",
	},
};

export const Outlined: Story = {
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "outlined",
	},
};

export const Disabled: Story = {
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "default",
		disabled: true,
	},
};

export const WithDefaultValue: Story = {
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "default",
		defaultValue: "Next.js",
	},
};
