import { useState } from "react";

interface CursorPaginationResult {
	currentPage: number;
	currentCursor: string | undefined;
	handlePageChange: (page: number, nextCursor?: string, hasMore?: boolean) => void;
	reset: () => void;
}

export function useCursorPagination(): CursorPaginationResult {
	const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([undefined]);
	const [pageIndex, setPageIndex] = useState(0);

	const currentPage = pageIndex + 1;
	const currentCursor = cursorHistory[pageIndex];

	const handlePageChange = (page: number, nextCursor?: string, hasMore?: boolean) => {
		if (page > currentPage && hasMore) {
			setCursorHistory((prev) => [...prev.slice(0, pageIndex + 1), nextCursor]);
			setPageIndex(page - 1);
		} else if (page < currentPage) {
			setPageIndex(page - 1);
		}
	};

	const reset = () => {
		setCursorHistory([undefined]);
		setPageIndex(0);
	};

	return { currentPage, currentCursor, handlePageChange, reset };
}
