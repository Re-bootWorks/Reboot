import PaginationItem from "./PaginationItem";
import IcMeetBalls from "@/components/ui/icons/IcMeetBalls";
import IcArrowLeft from "@/components/ui/icons/IcArrowLeft";
import IcArrowRight from "@/components/ui/icons/IcArrowRight";
import { cn } from "@/utils/cn";

type PaginationProps = {
	currentPage: number;
	totalPages: number;
	handlePageChange: (page: number) => void;
};

function getPaginationPages(currentPage: number, totalPages: number) {
	const pages: (number | string)[] = [];
	const maxVisible = 5;

	if (totalPages <= maxVisible) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	if (currentPage <= 3) {
		pages.push(1, 2, 3, 4, 5, "...", totalPages);
		return pages;
	}

	if (currentPage >= totalPages - 2) {
		pages.push(
			1,
			"...",
			totalPages - 4,
			totalPages - 3,
			totalPages - 2,
			totalPages - 1,
			totalPages,
		);
		return pages;
	}

	pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);

	return pages;
}
export default function Pagination({ currentPage, totalPages, handlePageChange }: PaginationProps) {
	const pages = getPaginationPages(currentPage, totalPages);

	return (
		<div className="flex h-8 w-[16.25rem] items-center justify-center md:h-12 md:w-[29.75rem]">
			<button
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={cn(
					"flex items-center justify-center transition-colors",
					"disabled:cursor-not-allowed disabled:opacity-50",
					currentPage === 1 ? "text-gray-400" : "text-gray-600 hover:text-gray-900",
				)}>
				<IcArrowLeft color={currentPage === 1 ? "gray-400" : "gray-800"} size="sm" />
			</button>
			<div className="mx-[0.625rem] flex items-center gap-1">
				{pages.map((page, index) => {
					const isNumber = typeof page === "number";

					if (page === "...") {
						return (
							<div key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center">
								<IcMeetBalls color="gray-400" size="sm" />
							</div>
						);
					}

					return (
						<PaginationItem
							key={page}
							page={page}
							isActive={currentPage === page}
							handlePageClick={isNumber ? () => handlePageChange(page) : undefined}
						/>
					);
				})}
			</div>
			<button
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={cn(
					"flex items-center justify-center transition-colors",
					"disabled:cursor-not-allowed disabled:opacity-50",
					currentPage === totalPages ? "text-gray-400" : "text-gray-600 hover:text-gray-900",
				)}>
				<IcArrowRight color={currentPage === totalPages ? "gray-400" : "gray-800"} size="sm" />
			</button>
		</div>
	);
}
