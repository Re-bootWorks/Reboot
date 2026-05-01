import { render, screen } from "@testing-library/react";
import InputFile from ".";

const placeholderText = "파일 첨부";
const hiddenInputSelector = 'input[type="file"]';

const mockPreviewUrl = "https://example.com/thumb.jpg";
const mockLabel = "테스트 라벨명";
const mockName = "customName";
const mockUseInputImage = {
	previewUrl: null as string | null,
	setPreviewUrl: jest.fn(),
	resetFile: jest.fn(),
	changeFile: jest.fn(),
};

jest.mock("next/image", () => {
	type MockImageProps = React.ImgHTMLAttributes<HTMLImageElement>;
	return function MockImage(props: MockImageProps) {
		return <img {...props} />;
	};
});

jest.mock("@/hooks/useInputImage", () => ({
	__esModule: true,
	default: () => mockUseInputImage,
}));

describe("InputFile 컴포넌트 테스트", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockUseInputImage.previewUrl = null;
	});

	test("커스텀 name이 input에 적용되어야 함", () => {
		render(<InputFile name={mockName} />);

		const input = document.querySelector(hiddenInputSelector);
		expect(input).toHaveAttribute("name", mockName);
	});

	test("커스텀 label이 렌더링되어야 함", () => {
		render(<InputFile name={mockName} label={mockLabel} />);

		expect(screen.getByText(mockLabel)).toBeInTheDocument();
		expect(document.querySelector(hiddenInputSelector)).toBeInTheDocument();
	});

	test("isPending이 true이면 로딩 오버레이가 표시되어야 함", () => {
		const { container } = render(<InputFile name={mockName} isPending />);
		const overlay = container.querySelector("svg");

		expect(overlay).toBeInTheDocument();
	});

	test("미리보기 이미지가 있으면 삭제 버튼이 보이고 플레이스홀더는 숨겨져야 함", () => {
		mockUseInputImage.previewUrl = mockPreviewUrl;
		render(<InputFile name={mockName} />);

		expect(screen.queryByText(placeholderText)).not.toBeInTheDocument();
		expect(screen.getByRole("button")).toBeInTheDocument();
		expect(screen.getByAltText("thumbnail")).toBeInTheDocument();
	});
});
