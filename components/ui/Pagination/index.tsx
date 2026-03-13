import PaginationItem from "./PaginationItem";
import IcMeetBalls from "@/components/ui/icons/IcMeetBalls";

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
				className="text-gray-600 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50">
				{"<"}
			</button>

			{pages.map((page, index) => {
				const isNumber = typeof page === "number";

				if (page === "...") {
					return (
						<div key={index} className="flex h-8 w-8 items-center justify-center">
							<IcMeetBalls color="gray-400" size="sm" />
						</div>
					);
				}

				return (
					<PaginationItem
						key={index}
						page={page}
						isActive={currentPage === page}
						handlePageClick={isNumber ? () => handlePageChange(page) : undefined}
					/>
				);
			})}

			<button
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="text-gray-600 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50">
				{">"}
			</button>
		</div>
	);
}
