import { render, screen } from "@testing-library/react";
import PersonnelContainer, {
	MIN_CONFIRMED_COUNT,
} from "@/features/meetupDetail/components/PersonnelContainer/index";

jest.mock("@/components/ui/Participants", () => ({
	Participants: () => <div />,
}));

const defaultProps = {
	meetingId: 1,
	capacity: 10,
	participantCount: 5,
	confirmedAt: null,
	hostId: 1,
};

// ─────────────────────────────────────────────
// PersonnelContainer
// ─────────────────────────────────────────────
describe("모임 참여 인원 현황 및 개설 확정 상태를 표시하는 컴포넌트", () => {
	describe("Progressbar와 participant 관련 일치 여부", () => {
		it("progressbar의 aria-valuenow가 participantCount와 일치한다.", () => {
			render(<PersonnelContainer {...defaultProps} participantCount={7} />);
			expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "7");
		});

		it("progressbar의 aria-valuemax가 capacity와 일치한다.", () => {
			render(<PersonnelContainer {...defaultProps} capacity={10} />);
			expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "10");
		});
	});

	describe("개설 확정 레이블", () => {
		it("confirmedAt이 있으면 개설 확정 레이블이 렌더링된다.", () => {
			render(<PersonnelContainer {...defaultProps} confirmedAt="2026-04-01T10:00:00.000Z" />);
			expect(screen.getByText("개설확정")).toBeInTheDocument();
		});

		it(`participantCount가 MIN_CONFIRMED_COUNT(${MIN_CONFIRMED_COUNT}) 이상이면 개설 확정 레이블이 렌더링된다.`, () => {
			render(
				<PersonnelContainer
					{...defaultProps}
					confirmedAt={null}
					participantCount={MIN_CONFIRMED_COUNT}
				/>,
			);
			expect(screen.getByText("개설확정")).toBeInTheDocument();
		});

		it("confirmedAt이 null이고 participantCount가 MIN_CONFIRMED_COUNT 미만이면 개설확정 레이블이 렌더링되지 않는다.", () => {
			render(
				<PersonnelContainer
					{...defaultProps}
					confirmedAt={null}
					participantCount={MIN_CONFIRMED_COUNT - 1}
				/>,
			);
			expect(screen.queryByText("개설확정")).not.toBeInTheDocument();
		});

		it("confirmedAt이 있고, participantCount가 MIN_CONFIRMED_COUNT 미만이어도 개설확정 레이블이 렌더링된다.", () => {
			render(
				<PersonnelContainer
					{...defaultProps}
					confirmedAt="2026-04-01T10:00:00.000Z"
					participantCount={MIN_CONFIRMED_COUNT - 1}
				/>,
			);
			expect(screen.getByText("개설확정")).toBeInTheDocument();
		});
	});
});
