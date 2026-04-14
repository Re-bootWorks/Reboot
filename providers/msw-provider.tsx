"use client";

import { Suspense, use } from "react";
import { initMocks } from "@/mocks";

// server-side에서 즉시 렌더링 / client-side에서 비동기 작업 대기
const mockingEnabledPromise = typeof window === "undefined" ? Promise.resolve() : initMocks();

function MSWProviderWrapper({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// promise가 완료될 때까지 fallback 표시
	use(mockingEnabledPromise);
	return children;
}

/**
 * @example
 * initMocks();
 * export default async function RootLayout() {
 *  return (
 *    <html>
 *      <body>
 *        <MSWProvider>
 *          <Component />
 *        </MSWProvider>
 *      </body>
 *    </html>
 *  );
 * }
 */
export function MSWProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Suspense fallback={null}>
			<MSWProviderWrapper>{children}</MSWProviderWrapper>
		</Suspense>
	);
}
