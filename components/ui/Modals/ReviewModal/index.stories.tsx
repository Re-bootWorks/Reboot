import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ReviewFormModal from ".";
import { useState } from "react";
import Button from "@/components/ui/Buttons/Button";

const meta: Meta<typeof ReviewFormModal> = {
	title: "UI/Modal/ReviewFormModal",
	component: ReviewFormModal,
	parameters: {
		layout: "centered",
	},
};
export default meta;

type Story = StoryObj<typeof ReviewFormModal>;

export const Default: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(true);
		return (
			<>
				<Button onClick={() => setIsOpen(true)} sizes="large">
					리뷰 모달 열기
				</Button>
				<ReviewFormModal
					mode="create"
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					handleFormSubmit={() => {}}
				/>
			</>
		);
	},
};
