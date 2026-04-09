import { useCallback, useState } from "react";

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

	const handlePageChange = useCallback((page: number, nextCursor?: string, hasMore?: boolean) => {
		setPageIndex((prevIndex) => {
			const prevPage = prevIndex + 1;

			if (page > prevPage && hasMore) {
				setCursorHistory((prev) => [...prev.slice(0, prevIndex + 1), nextCursor]);
				return page - 1;
			} else if (page < prevPage) {
				return page - 1;
			}

			return prevIndex;
		});
	}, []);

	const reset = useCallback(() => {
		setCursorHistory([undefined]);
		setPageIndex(0);
	}, []);

	return { currentPage, currentCursor, handlePageChange, reset };
}
