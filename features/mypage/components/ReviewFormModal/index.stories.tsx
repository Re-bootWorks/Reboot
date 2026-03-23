import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ReviewFormModal from ".";
import { useState } from "react";

const meta: Meta<typeof ReviewFormModal> = {
	title: "Features/My/ReviewFormModal",
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
			<ReviewFormModal
				mode="create"
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				handleFormSubmit={() => {}}
			/>
		);
	},
};
