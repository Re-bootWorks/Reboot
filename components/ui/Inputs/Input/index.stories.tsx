import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Input from "./index";
import { IcVisibilityOffOutline, IcCalendarOutline, IcLocation, IcArrowDown } from "../../icons";

const meta: Meta<typeof Input> = {
	title: "Inputs/Input",
	component: Input,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="w-100">
				<Story />
			</div>
		),
	],
	argTypes: {
		isDestructive: {
			control: "boolean",
			description: "에러 상태 여부. true일 때 border가 빨간색으로 변합니다.",
		},
		disabled: {
			control: "boolean",
			description: "비활성화 상태 여부.",
		},
		placeholder: {
			control: "text",
			description: "입력 필드의 placeholder 텍스트.",
		},
		leftIcon: {
			control: "boolean",
			description: "입력 필드 왼쪽에 표시되는 아이콘. (스토리북 확인용으로 boolean 처리)",
		},
		rightIcon: {
			control: "boolean",
			description: "입력 필드 오른쪽에 표시되는 아이콘. (스토리북 확인용으로 boolean 처리)",
		},
		onRightIconClick: {
			description: "오른쪽 아이콘 클릭 핸들러. 있으면 button으로 렌더링됩니다.",
		},
	},
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
	render: (args) => (
		<Input
			{...args}
			leftIcon={args.leftIcon ? <IcCalendarOutline /> : undefined}
			rightIcon={args.rightIcon ? <IcArrowDown /> : undefined}
		/>
	),
	args: {
		placeholder: "텍스트를 입력해주세요",
		leftIcon: false,
		rightIcon: false,
	},
};

export const Destructive: Story = {
	args: {
		placeholder: "텍스트를 입력해주세요",
		isDestructive: true,
	},
};

export const Disabled: Story = {
	args: {
		placeholder: "텍스트를 입력해주세요",
		disabled: true,
	},
};

export const WithLeftIcon: Story = {
	args: {
		placeholder: "YYYY-MM-DD",
		leftIcon: <IcCalendarOutline />,
	},
};

export const WithRightIcon: Story = {
	args: {
		placeholder: "건물, 지번 또는 도로명 검색",
		rightIcon: <IcLocation />,
	},
};

export const Password: Story = {
	args: {
		type: "password",
		placeholder: "비밀번호를 입력해주세요",
		rightIcon: <IcVisibilityOffOutline />,
		onRightIconClick: () => {},
	},
};
