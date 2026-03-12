import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SearchInput from "./index";

const meta = {
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
		inputSize: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "검색 입력 필드 크기",
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
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "default",
		inputSize: "md",
	},
};

export const Outlined: Story = {
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "outlined",
		inputSize: "md",
	},
};

export const Small: Story = {
	args: {
		placeholder: "검색어를 입력하세요",
		variant: "default",
		inputSize: "sm",
	},
};

export const Medium: Story = {
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "default",
		inputSize: "md",
	},
};

export const Large: Story = {
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "default",
		inputSize: "lg",
	},
};

export const Disabled: Story = {
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "default",
		inputSize: "md",
		disabled: true,
	},
};

export const WithDefaultValue: Story = {
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "default",
		inputSize: "md",
		defaultValue: "Next.js",
	},
};
