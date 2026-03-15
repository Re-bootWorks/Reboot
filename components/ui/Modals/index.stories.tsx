import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Modal } from ".";

const meta: Meta<typeof Modal> = {
	title: "UI/Modal",
	component: Modal,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof Modal>;

function ModalWrapper({
	title,
	footer,
	children,
	className = "max-w-140",
}: {
	title?: string;
	footer?: React.ReactNode;
	children: React.ReactNode;
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
				footer={footer}
				className={className}>
				{children}
			</Modal>
		</div>
	);
}

export const NoTitle: Story = {
	render: () => (
		<ModalWrapper>
			<p className="text-sm text-gray-600">타이틀이 없는 모달이에요.</p>
		</ModalWrapper>
	),
};

export const WithTitle: Story = {
	render: () => (
		<ModalWrapper title="모달 제목">
			<p className="text-sm text-gray-600">타이틀이 있는 모달이에요.</p>
		</ModalWrapper>
	),
};

export const WithFooter: Story = {
	render: () => (
		<ModalWrapper
			title="모달 제목"
			footer={
				<div className="flex gap-3">
					<button className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
						취소
					</button>
					<button className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
						확인
					</button>
				</div>
			}>
			<p className="text-sm text-gray-600">타이틀과 푸터가 있는 모달이에요.</p>
		</ModalWrapper>
	),
};

export const LongContent: Story = {
	render: () => (
		<ModalWrapper
			title="긴 콘텐츠"
			footer={
				<div className="flex gap-3">
					<button className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
						취소
					</button>
					<button className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
						확인
					</button>
				</div>
			}>
			<div className="flex flex-col gap-3">
				{Array.from({ length: 20 }).map((_, i) => (
					<p key={i} className="text-sm text-gray-600">
						콘텐츠 {i + 1}번째 줄이에요.
					</p>
				))}
			</div>
		</ModalWrapper>
	),
};
