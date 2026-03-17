import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import UtilityButton from ".";

const meta: Meta<typeof UtilityButton> = {
	title: "Buttons/UtilityButton",
	component: UtilityButton,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		pressed: {
			table: {
				disable: true,
			},
		},
		sizes: {
			control: "radio",
			description: "버튼의 크기 옵션",
			options: ["small", "medium", "large"],
		},
		isPending: {
			control: "boolean",
			description: "버튼의 pending 상태를 설정",
		},
		disabled: {
			control: "boolean",
			description: "버튼의 비활성화 여부를 설정",
		},
	},
	args: {
		sizes: "medium",
		isPending: false,
		disabled: false,
	},
};

export default meta;

type Story = StoryObj<typeof UtilityButton>;

export const Default: Story = {
	render: (args) => {
		const [pressed, setPressed] = useState(args.pressed ?? false);

		const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
			setPressed((prev) => !prev);
			args.onClick?.(e);
		};

		return (
			<div className="flex flex-col items-center gap-5">
				<UtilityButton {...args} pressed={pressed} onClick={handleClick} />
				<p className="text-sm text-gray-600">두번 이상 클릭으로 스타일 변화 확인</p>
			</div>
		);
	},
};

export const Pending: Story = {
	args: {
		isPending: true,
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};
