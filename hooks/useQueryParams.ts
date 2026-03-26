import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
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
	const router = useRouter();

	const get = (key: string) => searchParams.get(key);

	const set = useCallback(
		(params: Record<string, string | null | undefined>) => {
			const newParams = new URLSearchParams(searchParams.toString());

			Object.entries(params).forEach(([key, value]) => {
				if (value === null || value === undefined) {
					newParams.delete(key);
				} else {
					newParams.set(key, value);
				}
			});

			router.replace(`?${newParams.toString()}`);
		},
		[searchParams, router],
	);

	return { get, set };
}
