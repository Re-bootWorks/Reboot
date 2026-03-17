import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import RegionDropdown from ".";

const REGION_OPTIONS = [
	{ label: "강남구", value: "gangnam" },
	{ label: "강동구", value: "gangdong" },
	{ label: "강북구", value: "gangbuk" },
	{ label: "강서구", value: "gangseo" },
	{ label: "관악구", value: "gwanak" },
];

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
		options: {
			control: false,
			description: "드롭다운 옵션 목록",
		},
		value: {
			control: false,
		},
		defaultValue: {
			control: "text",
			description: "초기 선택 값",
		},
		placeholder: {
			control: "text",
			description: "선택 전 표시 문구",
		},
		buttonClassName: {
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
			description: "옵션 선택 시 호출",
		},
		type: {
			table: {
				disable: true,
			},
		},
	},
	args: {
		options: REGION_OPTIONS,
		placeholder: "지역을 선택해 주세요",
	},
};

export default meta;

type Story = StoryObj<typeof RegionDropdown>;

export const Default: Story = {
	args: {
		placeholder: "서울",
	},
	render: (args) => (
		<div className="h-75 w-md bg-white p-10">
			<RegionDropdown {...args} />
		</div>
	),
};

export const WithDefaultValue: Story = {
	args: {
		defaultValue: "gangnam",
	},
	render: (args) => (
		<div className="h-75 w-md bg-white p-10">
			<RegionDropdown {...args} />
		</div>
	),
};

export const Disabled: Story = {
	args: {
		placeholder: "서울",
		disabled: true,
	},
	render: (args) => (
		<div className="h-75 w-md bg-white p-10">
			<RegionDropdown {...args} />
		</div>
	),
};
