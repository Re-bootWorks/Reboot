import PaginationItem from "./PaginationItem";

type PaginationProps = {
	currentPage: number;
	totalPages: number;
	handlePageChange: (page: number) => void;
};

// 페이지네이션에 표시할 페이지 번호 목록을 계산하는 함수
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

// 페이지 이동 UI를 렌더링하는 Pagination 컴포넌트
export default function Pagination({ currentPage, totalPages, handlePageChange }: PaginationProps) {
	const pages = getPaginationPages(currentPage, totalPages);

	return (
		<div className="flex items-center gap-2">
			{/* 이전 페이지로 이동 */}
			<button
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="text-gray-600 hover:text-gray-900">
				{"<"}
			</button>

			{/* 페이지 번호 목록 렌더링 */}
			{pages.map((page, index) => {
				const isNumber = typeof page === "number";

				return (
					<PaginationItem
						key={index}
						page={page}
						isActive={currentPage === page}
						handlePageClick={isNumber ? () => handlePageChange(page) : undefined}
					/>
				);
			})}

			{/* 다음 페이지로 이동 */}
			<button
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="text-gray-600 hover:text-gray-900">
				{">"}
			</button>
		</div>
	);
}
