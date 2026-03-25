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
		isRequired: {
			control: "boolean",
			description: "필수 여부",
		},
		placeholder: {
			control: "text",
			description: "플레이스홀더",
		},
		value: {
			control: "text",
			description: "시간 값 (HH:mm 형식)",
		},
		disabled: {
			control: "boolean",
			description: "비활성화",
		},
		readOnly: {
			control: "boolean",
			description: "읽기 전용",
		},
		hintText: {
			control: "text",
			description: "힌트 문구",
		},
		isDestructive: {
			control: "boolean",
			description: "에러 상태",
		},
		name: {
			control: "text",
			description: "form 제출용 hidden input name",
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
		isRequired: false,
		value: "",
		disabled: false,
		readOnly: false,
		hintText: "",
		isDestructive: false,
		name: "",
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
};

export const Required: Story = {
	render: (args) => <ControlledTimePicker {...args} />,
	args: {
		isRequired: true,
	},
};

export const WithHint: Story = {
	render: (args) => <ControlledTimePicker {...args} />,
	args: {
		hintText: "저는 힌트 메시지입니다",
	},
};

export const Destructive: Story = {
	render: (args) => <ControlledTimePicker {...args} />,
	args: {
		hintText: "올바른 시간을 입력해 주세요.",
		isDestructive: true,
	},
};

export const Disabled: Story = {
	render: (args) => <ControlledTimePicker {...args} />,
	args: {
		disabled: true,
	},
};

export const InvalidValueFallback: Story = {
	render: (args) => <ControlledTimePicker {...args} />,
	args: {
		value: "99:99",
	},
};
