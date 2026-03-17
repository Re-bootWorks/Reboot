import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import InputField from "./index";
import { IcVisibilityOffOutline, IcLocation, IcCalendarOutline } from "../../icons";

const meta: Meta<typeof InputField> = {
	title: "ui/InputField",
	component: InputField,
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
			description: "에러 상태 여부. true일 때 border와 hintText가 빨간색으로 변합니다.",
		},
		disabled: {
			control: "boolean",
			description: "비활성화 상태 여부.",
		},
		isRequired: {
			control: "boolean",
			description: "필수 입력 여부. true일 때 label 옆에 * 표시가 나타납니다.",
		},
		placeholder: {
			control: "text",
			description: "입력 필드의 placeholder 텍스트.",
		},
		label: {
			control: "text",
			description: "입력 필드 상단에 표시되는 라벨. 없으면 렌더링되지 않습니다.",
		},
		hintText: {
			control: "text",
			description: "입력 필드 하단에 표시되는 힌트 또는 에러 메세지. 없으면 렌더링되지 않습니다.",
		},
	},
};

export default meta;

type Story = StoryObj<typeof InputField>;

export const Default: Story = {
	args: {
		label: "아이디",
		placeholder: "이메일을 입력해주세요",
		hintText: "텍스트를 입력해주세요.",
	},
};

export const Required: Story = {
	args: {
		label: "아이디",
		isRequired: true,
		placeholder: "이메일을 입력해주세요",
		hintText: "텍스트를 입력해주세요.",
	},
};

export const Destructive: Story = {
	args: {
		label: "아이디",
		isRequired: true,
		placeholder: "이메일을 입력해주세요",
		hintText: "에러 메세지입니다.",
		isDestructive: true,
	},
};

export const Disabled: Story = {
	args: {
		label: "아이디",
		placeholder: "이메일을 입력해주세요",
		hintText: "텍스트를 입력해주세요.",
		disabled: true,
	},
};

export const WithLeftIcon: Story = {
	args: {
		label: "모임 일정",
		isRequired: true,
		placeholder: "YYYY-MM-DD",
		leftIcon: <IcCalendarOutline />,
	},
};

export const WithRightIcon: Story = {
	args: {
		label: "주소",
		isRequired: true,
		placeholder: "건물, 지번 또는 도로명 검색",
		rightIcon: <IcLocation />,
	},
};

export const Password: Story = {
	args: {
		label: "비밀번호",
		isRequired: true,
		type: "password",
		placeholder: "비밀번호를 입력해주세요",
		rightIcon: <IcVisibilityOffOutline />,
		onRightIconClick: () => {},
	},
};

export const NoLabel: Story = {
	args: {
		placeholder: "이메일을 입력해주세요",
		hintText: "텍스트를 입력해주세요.",
	},
};
