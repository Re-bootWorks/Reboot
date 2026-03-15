import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import DatePicker from ".";

const meta: Meta<typeof DatePicker> = {
	title: "Pickers/DatePicker",
	component: DatePicker,
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "라벨",
		},
		required: {
			control: "boolean",
			description: "필수 여부",
		},
		placeholder: {
			control: "text",
			description: "플레이스홀더",
		},
		value: {
			control: "text",
			description: "날짜 값",
		},
		disabled: {
			control: "boolean",
			description: "비활성화",
		},
		readOnly: {
			control: "boolean",
			description: "읽기 전용",
		},
		className: {
			control: false,
		},
		onChange: {
			action: "changed",
			description: "값 변경",
		},
		id: {
			control: false,
		},
	},
	args: {
		label: "모임 일정",
		required: false,
		placeholder: "YYYY-MM-DD",
		value: "",
		disabled: false,
		readOnly: false,
	},
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

function ControlledDatePicker(args: React.ComponentProps<typeof DatePicker>) {
	const [value, setValue] = useState(args.value ?? "");

	return (
		<div className="w-[20rem]">
			<DatePicker
				{...args}
				value={value}
				onChange={(nextValue) => {
					setValue(nextValue);
					args.onChange?.(nextValue);
				}}
			/>
		</div>
	);
}

export const Default: Story = {
	render: (args) => <ControlledDatePicker {...args} />,
	args: {
		label: "모임 일정",
		placeholder: "YYYY-MM-DD",
	},
};
