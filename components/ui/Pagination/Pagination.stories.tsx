import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Pagination from "./index";

const meta: Meta<typeof Pagination> = {
	title: "UI/Pagination",
	component: Pagination,
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Pagination>;

/**
 * 기본 Pagination
 */
export const Default: Story = {
	render: () => {
		function PaginationStory() {
			const [currentPage, setCurrentPage] = useState(1);

			function handlePageChange(page: number) {
				setCurrentPage(page);
			}

			return (
				<Pagination currentPage={currentPage} totalPages={9} handlePageChange={handlePageChange} />
			);
		}

		return <PaginationStory />;
	},
};
