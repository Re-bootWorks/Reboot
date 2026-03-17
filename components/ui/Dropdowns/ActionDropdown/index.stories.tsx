import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ActionDropdown from ".";

const meta: Meta<typeof ActionDropdown> = {
	title: "Dropdowns/ActionDropdown",
	component: ActionDropdown,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		triggerType: {
			control: "radio",
			options: ["actions", "profile"],
			description: "트리거 버튼 타입",
		},
		actionsSize: {
			control: "radio",
			options: ["md", "xl"],
			description: "actions 타입일 때 IcMeetBalls 아이콘 크기",
		},
		triggerClassName: {
			control: false,
		},
		menuClassName: {
			control: false,
		},
		className: {
			control: false,
		},
		items: {
			control: false,
		},
		type: {
			table: {
				disable: true,
			},
		},
		onClick: {
			table: {
				disable: true,
			},
		},
	},
	args: {
		triggerType: "actions",
		actionsSize: "md",
	},
};

export default meta;

type Story = StoryObj<typeof ActionDropdown>;

export const Default: Story = {
	args: {
		triggerType: "actions",
		actionsSize: "md",
		items: [
			{
				label: "수정하기",
				onClick: () => {},
			},
			{
				label: "삭제하기",
				onClick: () => {},
			},
		],
	},
	render: (args) => <ActionDropdown {...args} />,
};

export const WithDangerItem: Story = {
	args: {
		triggerType: "actions",
		actionsSize: "md",
		items: [
			{
				label: "수정하기",
				onClick: () => {},
			},
			{
				label: "삭제하기",
				onClick: () => {},
				danger: true,
			},
		],
	},
	render: (args) => <ActionDropdown {...args} />,
};

export const ProfileMenu: Story = {
	args: {
		triggerType: "profile",
		items: [
			{
				label: "마이페이지",
				onClick: () => {},
			},
			{
				label: "로그아웃",
				onClick: () => {},
				danger: true,
			},
		],
	},
	render: (args) => <ActionDropdown {...args} />,
};
