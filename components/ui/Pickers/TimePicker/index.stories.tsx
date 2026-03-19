import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState, type ComponentProps } from "react";
import TimePicker from ".";

const meta: Meta<typeof TimePicker> = {
	title: "Pickers/TimePicker",
	component: TimePicker,
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
			description: "시간 값",
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
		label: "모임 시간",
		required: false,
		placeholder: "00:00",
		value: "",
		disabled: false,
		readOnly: false,
	},
};

export default meta;

type Story = StoryObj<typeof TimePicker>;

function ControlledTimePicker(args: ComponentProps<typeof TimePicker>) {
	const [value, setValue] = useState(args.value ?? "");

	useEffect(() => {
		setValue(args.value ?? "");
	}, [args.value]);

	return (
		<div className="h-50">
			<div className="w-[20rem]">
				<TimePicker
					{...args}
					value={value}
					onChange={(nextValue) => {
						setValue(nextValue);
						args.onChange?.(nextValue);
					}}
				/>
			</div>
		</div>
	);
}

export const Default: Story = {
	render: (args) => <ControlledTimePicker {...args} />,
	args: {
		label: "모임 시간",
		required: false,
		placeholder: "00:00",
	},
};

export const Required: Story = {
	render: (args) => <ControlledTimePicker {...args} />,
	args: {
		label: "모임 시간",
		required: true,
		placeholder: "00:00",
	},
};
