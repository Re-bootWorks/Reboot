import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// useQueryParams의 replace 버전
export function useReplaceQueryParams() {
	const pathname = usePathname();
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

			const queryString = newParams.toString();
			const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

			router.replace(nextUrl);
		},
		[pathname, searchParams, router],
	);

	return { get, set };
}
