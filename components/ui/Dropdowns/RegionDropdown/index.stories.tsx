import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import RegionDropdown from ".";

const REGION_OPTIONS = ["강남구", "강동구", "강북구", "강서구", "관악구"];

const meta: Meta<typeof RegionDropdown> = {
	title: "Dropdowns/RegionDropdown",
	component: RegionDropdown,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		backgrounds: {
			default: "white",
			values: [{ name: "white", value: "white" }],
		},
	},
	argTypes: {
		triggerLabel: {
			control: "text",
			description: "선택 전 트리거 Input에 표시할 기본 문구",
		},
		options: {
			control: false,
			description: "리스트박스에 표시할 옵션 목록",
		},
		value: {
			control: "text",
			description: "선택된 옵션 값",
		},
		defaultValue: {
			control: "text",
			description: "초기 선택 옵션 값",
		},
		placeholder: {
			control: "text",
			description: "값이 없을 때 표시할 문구",
		},
		disabled: {
			control: "boolean",
			description: "비활성화 여부",
		},
		inputClassName: {
			control: false,
		},
		optionsClassName: {
			control: false,
		},
		optionClassName: {
			control: false,
		},
		className: {
			control: false,
		},
		onChange: {
			action: "changed",
			description: "옵션 선택 시 선택된 옵션 문자열 반환",
		},
	},
	args: {
		triggerLabel: "서울",
		options: REGION_OPTIONS,
		placeholder: "선택해 주세요",
	},
};

export default meta;

type Story = StoryObj<typeof RegionDropdown>;

export const Default: Story = {
	render: (args) => (
		<div className="h-75 w-md bg-white p-10">
			<RegionDropdown {...args} />
		</div>
	),
};

export const WithDefaultValue: Story = {
	args: {
		defaultValue: "강남구",
	},
	render: (args) => (
		<div className="h-75 w-md bg-white p-10">
			<RegionDropdown {...args} />
		</div>
	),
};

export const WithValue: Story = {
	args: {
		value: "강동구",
	},
	render: (args) => (
		<div className="h-75 w-md bg-white p-10">
			<RegionDropdown {...args} />
		</div>
	),
};

export const Disabled: Story = {
	args: {
		disabled: true,
		defaultValue: "강남구",
	},
	render: (args) => (
		<div className="h-75 w-md bg-white p-10">
			<RegionDropdown {...args} />
		</div>
	),
};
