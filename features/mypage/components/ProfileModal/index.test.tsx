import { render, screen } from "@testing-library/react";
import ProfileModal from ".";
import userEvent from "@testing-library/user-event";
import { mockUserProfile } from "../../mockData";

const patchMutate = jest.fn();

jest.mock("@/components/ui/Modals", () => ({
	Modal: ({
		isOpen,
		title,
		onClose,
		children,
		footer,
	}: {
		isOpen: boolean;
		title?: string;
		onClose?: () => void;
		children: React.ReactNode;
		footer?: React.ReactNode;
	}) =>
		isOpen ? (
			<div role="dialog" aria-modal="true">
				{title && <h2>{title}</h2>}
				<button type="button" aria-label="모달 닫기" onClick={onClose}>
					닫기
				</button>
				<div>{children}</div>
				{footer && <div>{footer}</div>}
			</div>
		) : null,
}));

jest.mock("@/features/mypage/mutations", () => ({
	usePatchUsersMe: jest.fn(() => ({
		mutate: patchMutate,
		isPending: false,
	})),
}));

jest.mock("./ProfileImage", () => {
	return function MockProfileImage({
		value,
		handleImageChange,
		handleUploadPendingChange,
	}: {
		value: string | null;
		handleImageChange: (imageUrl: string | null) => void;
		handleUploadPendingChange?: (isPending: boolean) => void;
	}) {
		return (
			<div>
				<div data-testid="profile-image-value">{value ?? "no-image"}</div>
				<button type="button" onClick={() => handleImageChange("https://example.com/new.jpg")}>
					이미지 변경
				</button>
				<button type="button" onClick={() => handleUploadPendingChange?.(true)}>
					이미지 업로드 중
				</button>
			</div>
		);
	};
});

function renderProfileModal(props = {}) {
	const user = userEvent.setup();
	const onClose = jest.fn();

	render(<ProfileModal user={mockUserProfile} isOpen={true} onClose={onClose} {...props} />);
	return {
		user,
		onClose,
	};
}

describe("프로필 수정 모달 컴포넌트", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("프로필 수정 모달이 열리고 닫히는지 확인한다", () => {
		test("모달이 열리면 프로필이 기본값으로 렌더링 된다", () => {
			renderProfileModal();

			const title = screen.getByRole("heading", { name: "프로필 수정하기" });
			const name = screen.getByRole("textbox", { name: /닉네임/ });
			const email = screen.getByRole("textbox", { name: "아이디" });
			const image = screen.getByTestId("profile-image-value");

			expect(title).toBeInTheDocument();
			expect(name).toHaveValue("홍길동");
			expect(email).toHaveValue("test@example.com");
			expect(image).toHaveTextContent("https://example.com/profile.jpg");
		});

		test("닫기버튼 클릭 시 onClose가 호출되며 모달이 닫힌다", async () => {
			const { user, onClose } = renderProfileModal();
			const closeButton = screen.getByRole("button", { name: "모달 닫기" });

			await user.click(closeButton);

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe("프로필을 수정할 수 있는지 확인한다", () => {
		test("변경된 값이 없으면 mutation을 호출하지 않고 모달을 닫는다", async () => {
			const { user, onClose } = renderProfileModal();

			const editButton = screen.getByRole("button", { name: "수정하기" });
			await user.click(editButton);

			expect(patchMutate).not.toHaveBeenCalled();
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		test("닉네임만 변경하고 제출하면 변경된 필드만 payload로 전달된다.", async () => {
			const { user } = renderProfileModal();

			const name = screen.getByRole("textbox", { name: /닉네임/ });
			const editButton = screen.getByRole("button", { name: "수정하기" });

			await user.clear(name);
			await user.type(name, "김코딩");
			await user.click(editButton);

			expect(patchMutate).toHaveBeenCalledTimes(1);
			expect(patchMutate).toHaveBeenCalledWith({ name: "김코딩" });
		});

		test("이미지와 닉네임 모두 변경 시 변경된 필드가 payload로 전달된다", async () => {
			const { user } = renderProfileModal();

			const name = screen.getByRole("textbox", { name: /닉네임/ });
			const imageButton = screen.getByRole("button", { name: "이미지 변경" });
			const editButton = screen.getByRole("button", { name: "수정하기" });

			await user.clear(name);
			await user.type(name, "김코딩");
			await user.click(imageButton);
			await user.click(editButton);

			expect(patchMutate).toHaveBeenCalledWith({
				name: "김코딩",
				image: "https://example.com/new.jpg",
			});
		});
	});

	describe("잘못된 값 제출 시 유효성 검사 메세지를 확인한다", () => {
		test("닉네임을 비우고 제출하면 필수 입력 메세지가 보인다", async () => {
			const { user } = renderProfileModal();

			const name = screen.getByRole("textbox", { name: /닉네임/ });
			const editButton = screen.getByRole("button", { name: "수정하기" });

			await user.clear(name);
			await user.click(editButton);

			const message = screen.getByText("닉네임은 필수 입력 항목입니다.");
			expect(message).toBeInTheDocument();
			expect(patchMutate).not.toHaveBeenCalled();
		});
		test("닉네임이 8자 초과 시 길이 제한 메세지가 보인다", async () => {
			const { user } = renderProfileModal();

			const name = screen.getByRole("textbox", { name: /닉네임/ });
			const editButton = screen.getByRole("button", { name: "수정하기" });

			await user.clear(name);
			await user.type(name, "아홉글자닉네임테스트");
			await user.click(editButton);

			const message = screen.getByText("닉네임은 8자 이하로 입력해주세요.");
			expect(message).toBeInTheDocument();
			expect(patchMutate).not.toHaveBeenCalled();
		});
	});

	describe("수정 취소 시 모달이 닫히는지 확인한다", () => {
		test("변경된 내용이 없으면 취소 클릭 시 바로 모달이 닫긴다", async () => {
			const { user, onClose } = renderProfileModal();
			const closeButton = screen.getByRole("button", { name: "취소" });

			await user.click(closeButton);

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		test("변경된 내용이 있으면 취소 클릭 시 Alert가 열리고 Alert 확인 시 모달이 닫긴다", async () => {
			const { user, onClose } = renderProfileModal();

			const name = screen.getByRole("textbox", { name: /닉네임/ });
			const closeButton = screen.getByRole("button", { name: "취소" });

			await user.clear(name);
			await user.type(name, "김코딩");
			await user.click(closeButton);

			expect(onClose).not.toHaveBeenCalled();

			const alertMessage = screen.getByText("변경된 내용이 있습니다.수정을 취소하시겠습니까?");
			expect(alertMessage).toBeInTheDocument();

			const AlertButton = screen.getByRole("button", { name: "확인" });
			await user.click(AlertButton);
			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe("이미지 업로드 중 상태를 확인한다", () => {
		test("이미지 업로드 중이면 수정하기 버튼이 비활성화된다", async () => {
			const { user } = renderProfileModal();

			const uploadButton = screen.getByRole("button", { name: "이미지 업로드 중" });
			const editButton = screen.getByRole("button", { name: "수정하기" });

			await user.click(uploadButton);
			expect(editButton).toBeDisabled();
		});
	});
});
