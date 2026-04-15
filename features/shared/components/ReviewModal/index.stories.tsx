import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ReviewModal from ".";
import { useState } from "react";
import Button from "@/components/ui/Buttons/Button";

const meta: Meta<typeof ReviewModal> = {
	title: "UI/Modal/ReviewModal",
	component: ReviewModal,
	parameters: {
		layout: "centered",
	},
};
export default meta;

type Story = StoryObj<typeof ReviewModal>;

export const Default: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(true);
		return (
			<>
				<Button onClick={() => setIsOpen(true)} sizes="large">
					리뷰 모달 열기
				</Button>
				<ReviewModal
					mode="create"
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					handleFormSubmit={() => {}}
				/>
			</>
		);
	},
};
