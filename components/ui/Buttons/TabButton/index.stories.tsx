import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Controls, Primary, Stories, Subtitle, Title } from "@storybook/addon-docs/blocks";
import TabButton from ".";

const TAB_ITEMS = ["전체", "취미/여가", "스터디", "비즈니스", "운동/건강", "가족/육아", "기타"];

const meta: Meta<typeof TabButton> = {
	title: "Buttons/TabButton",
	component: TabButton,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			page: () => (
				<>
					<Title />
					<Subtitle />
					<Primary />
					<Controls />
					<Stories includePrimary={false} />
				</>
			),
		},
	},
	argTypes: {
		selected: {
			table: {
				disable: true,
			},
		},
		disabled: {
			control: "boolean",
			description: "버튼의 비활성화 여부를 설정",
		},
		children: {
			control: "text",
			description: "버튼 라벨",
		},
		type: {
			description: "기본 type은 button",
		},
	},
	args: {
		disabled: false,
		children: "전체",
	},
};

export default meta;

type Story = StoryObj<typeof TabButton>;

export const Playground: Story = {
	render: (args) => {
		const [selected, setSelected] = useState(false);

		return (
			<div className="flex flex-col items-center gap-5">
				<TabButton
					{...args}
					selected={selected}
					onClick={(e) => {
						setSelected((prev) => !prev);
						args.onClick?.(e);
					}}>
					{args.children}
				</TabButton>
			</div>
		);
	},
};

export const CategoryTabs: Story = {
	render: (args) => {
		const [activeTab, setActiveTab] = useState("전체");

		return (
			<div className="flex flex-nowrap items-center gap-1 p-4">
				{TAB_ITEMS.map((tab) => (
					<TabButton
						key={tab}
						{...args}
						selected={activeTab === tab}
						onClick={(e) => {
							setActiveTab(tab);
							args.onClick?.(e);
						}}>
						{tab}
					</TabButton>
				))}
			</div>
		);
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		children: "전체",
	},
};
