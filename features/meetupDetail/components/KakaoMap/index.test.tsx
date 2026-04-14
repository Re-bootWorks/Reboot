import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KakaoMap from "@/features/meetupDetail/components/KakaoMap/index";

const mockHandleShowToast = jest.fn();

jest.mock("next/script", () => ({
	__esModule: true,
	default: () => null,
}));

jest.mock("@/providers/toast-provider", () => ({
	useToast: () => ({ handleShowToast: mockHandleShowToast }),
}));

const defaultProps = {
	address: "서울시 광진구 자양동 123-45",
	latitude: 37.5407,
	longitude: 127.0693,
};

// ─────────────────────────────────────────────
// KakaoMap
// ─────────────────────────────────────────────
describe("모임 장소 지도 컴포넌트", () => {
	beforeAll(() => {
		process.env.NEXT_PUBLIC_KAKAO_JS_KEY = "test-kakao-key";
	});

	beforeEach(() => {
		jest.clearAllMocks();
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText: jest.fn().mockResolvedValue(undefined) },
			writable: true,
			configurable: true,
		});
	});

	it("복사 버튼 클릭 시 토스트 메시지가 호출된다", async () => {
		const user = userEvent.setup();
		render(<KakaoMap {...defaultProps} />);
		await user.click(screen.getByRole("button", { name: /복사/ }));
		expect(mockHandleShowToast).toHaveBeenCalledWith({
			message: "주소가 복사되었습니다!",
			status: "success",
		});
	});
});
