import type { SetupWorker } from "msw/browser";
import handlers from "./handlers";

// 전역 객체에 워커 인스턴스 자체를 저장
declare global {
	interface Window {
		mswWorker?: SetupWorker;
	}
}

export async function initMocks() {
	if (process.env.NODE_ENV !== "development") return;

	if (typeof window === "undefined") {
		// server-side
		const { server } = await import("./server");
		return server.listen({ onUnhandledRequest: "bypass" });
	} else {
		if (!window.mswWorker) {
			// client-side
			const { worker } = await import("./browser");
			// handler가 누적되는 이슈 수정
			window.mswWorker = worker;
			worker.use(...handlers);
			await worker.start({ onUnhandledRequest: "bypass" });
		} else {
			// 이미 존재하는 경우 worker 재사용
			const worker = window.mswWorker;
			worker.use(...handlers);
		}
	}
}
