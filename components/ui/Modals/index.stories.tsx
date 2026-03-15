import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Modal } from ".";

const meta: Meta<typeof Modal> = {
	title: "UI/Modal",
	component: Modal,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		title: {
			control: "text",
			description: "모달 헤더에 표시될 타이틀을 설정합니다.",
		},
		className: {
			control: "text",
			description: "모달 너비 등 추가 스타일을 설정합니다.",
		},
		children: {
			control: "boolean",
			description: "body 콘텐츠 표시 여부를 설정합니다.",
		},
		footer: {
			control: "boolean",
			description: "footer 표시 여부를 설정합니다.",
		},
		isOpen: {
			table: { disable: true },
		},
		onClose: {
			table: { disable: true },
		},
	},
};

export default meta;
type Story = StoryObj<typeof Modal>;

function ModalWrapper({
	title,
	hasChildren = true,
	hasFooter = false,
	className = "max-w-140",
}: {
	title?: string;
	hasChildren?: boolean;
	hasFooter?: boolean;
	className?: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<button
				onClick={() => setIsOpen(true)}
				className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
				모달 열기
			</button>
			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title={title}
				className={className}
				footer={
					hasFooter ? (
						<div className="flex gap-3">
							<button className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
								취소
							</button>
							<button className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
								확인
							</button>
						</div>
					) : undefined
				}>
				{hasChildren && <p className="text-sm text-gray-600">모달 본문 내용이에요.</p>}
			</Modal>
		</div>
	);
}

export const Default: Story = {
	args: {
		title: "모달 제목",
		children: true,
		footer: false,
	},
	render: (args) => (
		<ModalWrapper
			title={args.title as string}
			className={args.className}
			hasChildren={args.children as unknown as boolean}
			hasFooter={args.footer as unknown as boolean}
		/>
	),
};

export const NoTitle: Story = {
	args: {
		children: true,
		footer: false,
	},
	render: (args) => (
		<ModalWrapper
			className={args.className}
			hasChildren={args.children as unknown as boolean}
			hasFooter={args.footer as unknown as boolean}
		/>
	),
};

export const WithFooter: Story = {
	args: {
		title: "모달 제목",
		children: true,
		footer: true,
	},
	render: (args) => (
		<ModalWrapper
			title={args.title as string}
			className={args.className}
			hasChildren={args.children as unknown as boolean}
			hasFooter={args.footer as unknown as boolean}
		/>
	),
};

export const LongContent: Story = {
	args: {
		title: "긴 콘텐츠",
		children: true,
		footer: true,
	},
	render: (args) => (
		<ModalWrapper
			title={args.title as string}
			className={args.className}
			hasChildren={args.children as unknown as boolean}
			hasFooter={args.footer as unknown as boolean}
		/>
	),
};
