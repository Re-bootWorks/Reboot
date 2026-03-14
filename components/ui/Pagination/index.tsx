import PaginationItem from "./PaginationItem";
import IcMeetBalls from "@/components/ui/icons/IcMeetBalls";
import IcChevronRight from "@/components/ui/icons/IcChevronRight";
import { cn } from "@/utils/cn";

type PaginationProps = {
	currentPage: number;
	totalPages: number;
	handlePageChange: (page: number) => void;
};

function getPaginationPages(currentPage: number, totalPages: number) {
	const pages: (number | string)[] = [];

	const startPage = Math.max(currentPage - 1, 2);
	const endPage = Math.min(currentPage + 1, totalPages - 1);

	pages.push(1);

	if (startPage > 2) {
		pages.push("...");
	}

	for (let page = startPage; page <= endPage; page++) {
		pages.push(page);
	}

	if (endPage < totalPages - 1) {
		pages.push("...");
	}

	if (totalPages > 1) {
		pages.push(totalPages);
	}

	return pages;
}

export default function Pagination({ currentPage, totalPages, handlePageChange }: PaginationProps) {
	const pages = getPaginationPages(currentPage, totalPages);

	return (
		<div className="flex items-center gap-2">
			<button
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={cn(
					"flex items-center justify-center transition-colors",
					"disabled:cursor-not-allowed disabled:opacity-50",
					currentPage === 1 ? "text-gray-400" : "text-gray-600 hover:text-gray-900",
				)}
				aria-label="이전 페이지">
				<IcChevronRight
					className="rotate-180"
					color={currentPage === 1 ? "gray-400" : "gray-600"}
					size="sm"
				/>
			</button>

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

			<button
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={cn(
					"flex items-center justify-center transition-colors",
					"disabled:cursor-not-allowed disabled:opacity-50",
					currentPage === totalPages ? "text-gray-400" : "text-gray-600 hover:text-gray-900",
				)}
				aria-label="다음 페이지">
				<IcChevronRight color={currentPage === totalPages ? "gray-400" : "gray-600"} size="sm" />
			</button>
		</div>
	);
}
