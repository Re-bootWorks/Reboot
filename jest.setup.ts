import "@testing-library/jest-dom";
import { server } from "@/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 브라우저 API 모킹
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// IntersectionObserver 모킹
class MockIntersectionObserver {
	constructor(_callBack: IntersectionObserverCallback, _option?: IntersectionObserverInit) {}
	observe() {
		return null;
	}
	unobserve() {
		return null;
	}
	disconnect() {
		return null;
	}
	takeRecords() {
		return [];
	}
}

Object.defineProperty(globalThis, "IntersectionObserver", {
	writable: true,
	configurable: true,
	value: MockIntersectionObserver,
});

// jsdom이 ResizeObserver를 지원하지 않아, headless ui 라이브러리에서 에러 발생으로, 해당 코드 추가
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};
