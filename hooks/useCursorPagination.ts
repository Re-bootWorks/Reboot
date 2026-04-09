import { useCallback, useReducer } from "react";

interface PaginationState {
	pageIndex: number;
	cursorHistory: (string | undefined)[];
}

type PaginationAction =
	| { type: "GO_TO_PAGE"; page: number; nextCursor?: string; hasMore?: boolean }
	| { type: "RESET" };

interface CursorPaginationResult {
	currentPage: number;
	currentCursor: string | undefined;
	handlePageChange: (page: number, nextCursor?: string, hasMore?: boolean) => void;
	reset: () => void;
}

function paginationReducer(state: PaginationState, action: PaginationAction): PaginationState {
	switch (action.type) {
		case "GO_TO_PAGE": {
			const { page, nextCursor, hasMore } = action;
			const targetIndex = page - 1;
			const prevPage = state.pageIndex - 1;
			if (page > prevPage && hasMore) {
				return {
					pageIndex: targetIndex,
					cursorHistory: [...state.cursorHistory.slice(0, state.pageIndex + 1), nextCursor],
				};
			}

			return {
				...state,
				pageIndex: targetIndex,
			};
		}

		case "RESET":
			return {
				pageIndex: 0,
				cursorHistory: [undefined],
			};

		default:
			return state;
	}
}

export function useCursorPagination(): CursorPaginationResult {
	const [state, dispatch] = useReducer(paginationReducer, {
		pageIndex: 0,
		cursorHistory: [undefined],
	});

	const { pageIndex, cursorHistory } = state;
	const currentPage = pageIndex + 1;
	const currentCursor = cursorHistory[pageIndex];

	const handlePageChange = useCallback((page: number, nextCursor?: string, hasMore?: boolean) => {
		dispatch({ type: "GO_TO_PAGE", page, nextCursor, hasMore });
	}, []);

	const reset = useCallback(() => {
		dispatch({ type: "RESET" });
	}, []);

	return { currentPage, currentCursor, handlePageChange, reset };
}
