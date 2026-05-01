import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FileField from ".";

const hiddenInputSelector = 'input[type="file"]';

const mockImgUrl = "https://example.com/image.jpg";
const createFile = () => new File(["dummy"], "image.jpg", { type: "image/jpg" });

const mockHandleShowToast = jest.fn();
jest.mock("@/providers/toast-provider", () => ({
	useToast: () => ({ handleShowToast: mockHandleShowToast }),
}));

jest.mock("@/hooks/useInputImage", () => ({
	__esModule: true,
	default: ({ onChange }: { onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => ({
		previewUrl: null,
		setPreviewUrl: jest.fn(),
		resetFile: jest.fn(),
		changeFile: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e),
	}),
}));

jest.mock("next/image", () => {
	return function MockImage(props: { alt: string; src: string }) {
		return <img alt={props.alt} src={props.src} />;
	};
});

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return function Wrapper({ children }: { children: React.ReactNode }) {
		return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
	};
}

describe("FileField 컴포넌트 테스트", () => {
	let onChange = jest.fn();
	let uploadImageFn = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		uploadImageFn;
	});

	test("이미지 업로드 성공 시 onChange와 성공 토스트가 호출되어야 함", async () => {
		uploadImageFn.mockResolvedValue(mockImgUrl);

		render(<FileField onChange={onChange} uploadImageFn={uploadImageFn} />, {
			wrapper: createWrapper(),
		});

		const input = document.querySelector(hiddenInputSelector) as HTMLInputElement;

		const user = userEvent.setup();
		await user.upload(input, createFile());

		await waitFor(() => {
			expect(uploadImageFn).toHaveBeenCalled();
		});
		expect(uploadImageFn.mock.calls[0][0]).toEqual(createFile());

		await waitFor(() => {
			expect(onChange).toHaveBeenCalledWith(mockImgUrl, expect.any(Object));
		});
		expect(mockHandleShowToast).toHaveBeenCalledWith({
			message: "이미지가 업로드되었습니다.",
			status: "success",
		});
	});

	test("이미지 업로드 실패 시 에러 토스트가 호출되어야 함", async () => {
		uploadImageFn.mockRejectedValue(new Error("업로드 실패"));

		render(<FileField onChange={onChange} uploadImageFn={uploadImageFn} />, {
			wrapper: createWrapper(),
		});

		const input = document.querySelector(hiddenInputSelector) as HTMLInputElement;

		const user = userEvent.setup();
		await user.upload(input, createFile());

		await waitFor(() => {
			expect(mockHandleShowToast).toHaveBeenCalledWith({
				message: "업로드 실패",
				status: "error",
			});
		});
	});

	test("커스텀 name이 적용되어야 함", () => {
		const name = "customThumbnail";
		render(<FileField name={name} onChange={onChange} uploadImageFn={uploadImageFn} />, {
			wrapper: createWrapper(),
		});

		const input = document.querySelector(hiddenInputSelector) as HTMLInputElement;
		expect(input).toHaveAttribute("name", name);
	});
});
