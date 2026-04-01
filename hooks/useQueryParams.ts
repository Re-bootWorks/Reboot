import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * @example
 * const value = get(<keyA>);
 * set({ <keyA>: <valueA>, <keyB>: <valueB> });
 * set({ <keyA>: null });
 * set({ <keyA>: null, <keyB>: <valueB> });
 */
export function useQueryParams() {
	const searchParams = useSearchParams();

	const get = (key: string) => searchParams.get(key);

	const set = useCallback((params: Record<string, string | null | undefined>) => {
		const newParams = new URLSearchParams(searchParams.toString());

		Object.entries(params).forEach(([key, value]) => {
			if (value === null || value === undefined) {
				newParams.delete(key);
			} else {
				newParams.set(key, value);
			}
		});
		/**
		 * @description
		 * router.replace 사용 시 서버 컴포넌트 리렌더링으로 인해 속도 저하 발생
		 * 따라서 windows.history.replaceState 로 교체
		 * 하단 방식은 서버 컴포넌트 searchParams prop 사용 시 문제 발생 가능성 있음
		 */
		window.history.replaceState(null, "", `?${newParams.toString()}`);
	}, []);

	return { get, set };
}
