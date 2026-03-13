import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Pagination from "./index";

const meta: Meta<typeof Pagination> = {
	title: "UI/Pagination",
	component: Pagination,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
	render: () => {
		const [currentPage, setCurrentPage] = useState(1);

		const handlePageChange = (page: number) => {
			setCurrentPage(page);
		};

		return (
			<Pagination currentPage={currentPage} totalPages={9} handlePageChange={handlePageChange} />
		);
	},
};
