import { render, screen } from "@testing-library/react";
import ReviewModal from ".";
import userEvent from "@testing-library/user-event";
jest.mock("@smastrom/react-rating", () => ({
	Rating: ({
		onChange,
		value,
		disabled,
	}: {
		onChange?: (value: number) => void;
		value?: number;
		disabled?: boolean;
	}) => (
		<div>
			<div data-testid="rating-value">{value ?? 0}</div>
			<button type="button" data-testid="rating" disabled={disabled} onClick={() => onChange?.(4)}>
				별점 선택
			</button>
		</div>
	),
}));

function renderReviewModal(props = {}) {
	const onClose = jest.fn();
	const handleFormSubmit = jest.fn();

	const utils = render(
		<ReviewModal
			mode="create"
			isOpen={true}
			onClose={onClose}
			handleFormSubmit={handleFormSubmit}
			{...props}
		/>,
	);
	return {
		...utils,
		onClose,
		handleFormSubmit,
	};
}

describe("ReviewModal", () => {
	describe("isOpen 상태에 따라 모달이 열리고 닫히는지 확인", () => {
		test("isOpen이 true면 모달이 열리고 메시지가 보인다", () => {
			renderReviewModal();

			expect(screen.getByText("만족스러운 경험이었나요?")).toBeInTheDocument();
		});
		test("isOpen이 false면 모달이 렌더링되지 않는다.", () => {
			renderReviewModal({ isOpen: false });

			expect(screen.queryByText("만족스러운 경험이었나요?")).not.toBeInTheDocument();
		});
	});

	describe("onClose 확인", () => {
		test("취소 버튼 클릭 시 onClose가 호출되는지 확인", async () => {
			const { onClose } = renderReviewModal();

			const user = userEvent.setup();
			const button = screen.getByRole("button", { name: "취소" });

			await user.click(button);

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe("mode 분기 확인", () => {
		test("create 모드면 '리뷰 작성' 타이틀과 '작성 완료' 버튼이 보인다", () => {
			renderReviewModal({ mode: "create" });

			const title = screen.getByText("리뷰 작성");
			expect(title).toBeInTheDocument();

			const button = screen.getByRole("button", { name: "작성 완료" });
			expect(button).toBeInTheDocument();
		});

		test("edit 모드면 '리뷰 수정' 타이틀과 '수정 완료' 버튼이 보인다", () => {
			renderReviewModal({ mode: "edit" });

			const title = screen.getByText("리뷰 수정");
			expect(title).toBeInTheDocument();

			const button = screen.getByRole("button", { name: "수정 완료" });
			expect(button).toBeInTheDocument();
		});
	});

	describe("초기값 반영 확인", () => {
		test("edit 모드에서 초기 score와 comment가 반영된다", () => {
			renderReviewModal({ mode: "edit", initialValue: { score: 4, comment: "리뷰 내용" } });

			const score = screen.getByTestId("rating-value");
			expect(score).toBeInTheDocument();
			expect(score).toHaveTextContent("4");

			const comment = screen.getByDisplayValue("리뷰 내용");
			expect(comment).toBeInTheDocument();
		});
	});

	describe("form 제출 확인", () => {
		test("별점과 리뷰를 제출하면 handleFormSubmit이 호출된다", async () => {
			const { handleFormSubmit } = renderReviewModal();
			const user = userEvent.setup();

			await user.click(screen.getByTestId("rating")); // score 4
			await user.type(screen.getByRole("textbox"), "리뷰를 작성합니다");
			await user.click(screen.getByRole("button", { name: "작성 완료" }));

			expect(handleFormSubmit).toHaveBeenCalledTimes(1);
			expect(handleFormSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					score: 4,
					comment: "리뷰를 작성합니다",
				}),
			);
		});
	});

	describe("validation 확인", () => {
		test("별점과 리뷰를 입력하지 않고 제출하면 validation 메시지가 표시된다", async () => {
			const { handleFormSubmit } = renderReviewModal();
			const user = userEvent.setup();

			await user.click(screen.getByRole("button", { name: "작성 완료" }));

			expect(handleFormSubmit).not.toHaveBeenCalled();

			const score = screen.getByText("평점을 선택해 주세요.");
			expect(score).toBeInTheDocument();

			const comment = screen.getByText("리뷰 내용을 입력해 주세요.");
			expect(comment).toBeInTheDocument();
		});
	});

	describe("dirty 상태 확인", () => {
		test("변경된 내용이 없으면 취소 클릭 시 바로 onClose가 호출된다", async () => {
			const { onClose } = renderReviewModal({
				mode: "edit",
				initialValue: { score: 4, comment: "기존 리뷰" },
			});
			const user = userEvent.setup();

			await user.click(screen.getByRole("button", { name: "취소" }));

			expect(onClose).toHaveBeenCalledTimes(1);
		});
		describe("Alert 동작 확인", () => {
			test("작성 중 취소시 dirty 상태면 Alert이 열리는지 확인", async () => {
				renderReviewModal();
				const user = userEvent.setup();

				await user.type(screen.getByRole("textbox"), "리뷰를 작성합니다");
				await user.click(screen.getByRole("button", { name: "취소" }));

				const alert = screen.getByText("리뷰 작성을 취소하시겠습니까?");
				expect(alert).toBeInTheDocument();
			});
			test("수정 중 취소시 dirty 상태면 Alert이 열리는지 확인", async () => {
				renderReviewModal({ mode: "edit", initialValue: { score: 4, comment: "기존 리뷰" } });
				const user = userEvent.setup();

				const textarea = screen.getByDisplayValue("기존 리뷰");
				await user.clear(textarea);
				await user.type(screen.getByRole("textbox"), "수정된 리뷰");
				await user.click(screen.getByRole("button", { name: "취소" }));

				const alert = screen.getByText("리뷰 수정을 취소하시겠습니까?");
				expect(alert).toBeInTheDocument();
			});
		});
	});

	describe("isPending 상태 확인", () => {
		test("isPending이 true면 제출 버튼이 비활성화된다", () => {
			renderReviewModal({ isPending: true });

			const button = screen.getByRole("button", { name: "요청 처리 중" });

			expect(button).toBeDisabled();
		});
	});
});
