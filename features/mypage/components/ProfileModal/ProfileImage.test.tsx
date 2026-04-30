import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileImage from "./ProfileImage";

const mockFns = {
	uploadImage: jest.fn(),
	resetFile: jest.fn(),
	changeFile: jest.fn(),
};

jest.mock("@/components/ui/Avatar", () => {
	return function MockAvatar({ src }: { src: string | null }) {
		return <div data-testid="avatar-src">{src ?? "no-image"}</div>;
	};
});

jest.mock("@/hooks/useInputImage", () => ({
	__esModule: true,
	default: () => ({
		previewUrl: null,
		resetFile: mockFns.resetFile,
		changeFile: mockFns.changeFile,
	}),
}));

jest.mock("@/features/mypage/mutations", () => ({
	useUploadProfileImage: () => ({
		mutateAsync: mockFns.uploadImage,
		isPending: false,
	}),
}));

function renderProfileImage(props = {}) {
	const user = userEvent.setup();
	const handleImageChange = jest.fn();
	const handleUploadPendingChange = jest.fn();

	render(
		<ProfileImage
			initialImageUrl="https://example.com/profile.jpg"
			value="https://example.com/profile.jpg"
			isOpen={true}
			handleImageChange={handleImageChange}
			handleUploadPendingChange={handleUploadPendingChange}
			{...props}
		/>,
	);

	return {
		user,
		handleImageChange,
		handleUploadPendingChange,
	};
}

// 테스트용 이미지 파일
function createImageFile({ name = "profile.png", type = "image/png", size = 1024 } = {}) {
	return new File([new Uint8Array(size)], name, { type });
}

function getFileInput() {
	return document.querySelector('input[type="file"]') as HTMLInputElement;
}

describe("프로필 이미지 업로드 컴포넌트", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockFns.uploadImage.mockResolvedValue("https://example.com/uploaded.jpg");
	});

	test("현재 프로필 이미지가 렌더링된다", () => {
		renderProfileImage();

		const profileImage = screen.getByTestId("avatar-src");

		expect(profileImage).toHaveTextContent("https://example.com/profile.jpg");
	});

	test("이미지 크기가 1MB 초과 시 용량 제한 메세지가 보인다", async () => {
		const { user, handleImageChange } = renderProfileImage();
		const oversizedImage = createImageFile({ size: 1024 * 1024 + 1 });
		const fileInput = getFileInput();

		await user.upload(fileInput, oversizedImage);

		const errorMessage = screen.getByText("파일 크기는 1MB를 초과할 수 없습니다.");

		expect(errorMessage).toBeInTheDocument();
		expect(mockFns.uploadImage).not.toHaveBeenCalled();
		expect(handleImageChange).toHaveBeenCalledWith("https://example.com/profile.jpg");
	});

	test("지원하지 않는 이미지 형식이면 형식 제한 메세지가 보인다", async () => {
		renderProfileImage();
		const textFile = createImageFile({ name: "profile.txt", type: "text/plain" });
		const fileInput = getFileInput();

		fireEvent.change(fileInput, {
			target: { files: [textFile] },
		});

		const errorMessage = await screen.findByText(
			"JPEG, PNG, WebP, GIF 형식의 이미지만 업로드 가능합니다.",
		);

		expect(errorMessage).toBeInTheDocument();
		expect(mockFns.uploadImage).not.toHaveBeenCalled();
	});

	test("이미지 업로드 성공 시 업로드된 이미지 URL을 전달한다", async () => {
		const { user, handleImageChange } = renderProfileImage();
		const image = createImageFile();
		const fileInput = getFileInput();

		await user.upload(fileInput, image);

		expect(mockFns.changeFile).toHaveBeenCalled();
		expect(mockFns.uploadImage).toHaveBeenCalledWith(image);
		expect(handleImageChange).toHaveBeenCalledWith("https://example.com/uploaded.jpg");
	});

	test("업로드된 이미지 삭제 시 이미지가 삭제된다", async () => {
		const { user, handleImageChange } = renderProfileImage({
			initialImageUrl: null,
			value: "https://example.com/uploaded.jpg",
		});
		const deleteButton = screen.getByRole("button", { name: "업로드 이미지 삭제" });

		await user.click(deleteButton);

		expect(mockFns.resetFile).toHaveBeenCalled();
		expect(handleImageChange).toHaveBeenCalledWith(null);
	});
});
