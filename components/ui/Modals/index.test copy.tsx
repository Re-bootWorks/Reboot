// import Modal from ".";
// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";

// describe("Modal 테스트", () => {
// 	describe("렌더링 검사", () => {
// 		it("isOpen=true일 때 모달이 렌더링 되는지 확인", () => {
// 			render(
// 				<Modal isOpen={true} onClose={jest.fn()}>
// 					모달내용
// 				</Modal>,
// 			);
// 			expect(screen.getByText("모달내용")).toBeInTheDocument();
// 		});
// 		it("isOpen=false일 때 모달이 렌더링 되지 않는지 확인");
// 		it("title이 렌더링 되는지 확인");
// 		it("children이 렌더링 되는지 확인");
// 		it("footer가 렌더링 되는지 확인");
// 		it("hideCloseButton=true일 때 닫기 버튼이 없는지 확인");
// 		it("isCenterTitle=true일 때 타이틀이 중앙 정렬 클래스를 가지는지 확인");
// 	});

// 	describe("클릭 검사", () => {
// 		it("닫기 버튼 클릭 시 onClose가 호출되는지 확인");
// 		it("모달 바깥 클릭 시 onClose가 호출되는지 확인");
// 	});

// 	describe("키보드 검사", () => {
// 		it("ESC 키 입력 시 onClose가 호출되는지 확인");
// 	});
// });
