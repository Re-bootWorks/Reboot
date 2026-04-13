import { Participant } from "@/features/meetupDetail/types";
import { createRef } from "react";
import ParticipantDropdown from "@/features/meetupDetail/components/Participants/ParticipantDropdown/index";
import { render, screen } from "@testing-library/react";

const makeParticipant = (override: Partial<Participant> = {}): Participant => ({
	id: 1,
	teamId: "lucky7",
	meetingId: 1,
	userId: 1,
	joinedAt: "2026-04-01T00:00:00.000Z",
	user: { id: 1, name: "홍길동", image: "/profile.png" },
	...override,
});

const defaultProps = {
	participants: [makeParticipant()],
	hasNextPage: false,
	isFetchingNextPage: false,
	onLoadMore: jest.fn(),
	dropdownRef: createRef<HTMLDivElement>(),
	hostId: 1,
};

// ─────────────────────────────────────────────
// ParticipantDropdown
// ─────────────────────────────────────────────
describe("참여자 목록 드롭다운 컴포넌트", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("참여자가 없을 시, 아무것도 렌더링되지 않는다.", () => {
		render(<ParticipantDropdown {...defaultProps} participants={[]} />);
		expect(screen.queryByRole("img")).not.toBeInTheDocument();
	});

	describe("호스트 크라운 아이콘", () => {
		it("userId와 hostId가 일치하는 참여자에게 크라운 아이콘이 표시된다.", () => {
			const participants = [
				makeParticipant({ id: 1, userId: 1, user: { id: 1, name: "호스트", image: "/a.svg" } }),
				makeParticipant({ id: 2, userId: 2, user: { id: 2, name: "게스트", image: "/b.svg" } }),
			];
			render(<ParticipantDropdown {...defaultProps} participants={participants} hostId={1} />);
			const hostRow = screen.getByText("호스트").closest("div");
			expect(hostRow?.querySelector("svg")).toBeInTheDocument();
		});

		it("userId와 hostId가 일치하지 않는 참여자에게는 크라운 아이콘이 표시되지 않는다.", () => {
			const participants = [
				makeParticipant({ id: 2, userId: 2, user: { id: 2, name: "게스트", image: "/b.svg" } }),
			];
			render(<ParticipantDropdown {...defaultProps} participants={participants} hostId={1} />);
			const guestRow = screen.getByText("게스트").closest("div");
			expect(guestRow?.querySelector("svg")).not.toBeInTheDocument();
		});
	});

	describe("로딩 상태", () => {
		it("isFetchingNextPage이 true일 때 로딩 인디케이터가 렌더링된다", () => {
			render(<ParticipantDropdown {...defaultProps} isFetchingNextPage={true} />);
			expect(document.querySelector("svg")).toBeInTheDocument();
		});

		it("isFetchingNextPage이 false일 때 로딩 인디케이터가 렌더링되지 않는다", () => {
			const participants = [
				makeParticipant({ id: 1, userId: 99, user: { id: 99, name: "게스트", image: "/a.svg" } }),
			];
			render(
				<ParticipantDropdown
					{...defaultProps}
					participants={participants}
					isFetchingNextPage={false}
					hostId={999}
				/>,
			);
			expect(document.querySelector("svg")).not.toBeInTheDocument();
		});
	});

	describe("스크롤 동작", () => {
		function triggerScroll(container: HTMLElement) {
			Object.defineProperty(container, "scrollTop", { value: 100, configurable: true });
			Object.defineProperty(container, "clientHeight", { value: 200, configurable: true });
			Object.defineProperty(container, "scrollHeight", { value: 300, configurable: true });
			container.dispatchEvent(new Event("scroll"));
		}

		it("hasNextPage가 true이고 스크롤이 바닥에 도달하면 onLoadMore이 호출된다.", () => {
			const onLoadMore = jest.fn();
			render(
				<ParticipantDropdown
					{...defaultProps}
					hasNextPage={true}
					isFetchingNextPage={false}
					onLoadMore={onLoadMore}
				/>,
			);
			triggerScroll(document.querySelector(".max-h-60") as HTMLElement);
			expect(onLoadMore).toHaveBeenCalledTimes(1);
		});

		it("hasNextPage가 false이면 스크롤 바닥에 도달해도 onLoadMore가 호출되지 않는다", () => {
			const onLoadMore = jest.fn();
			render(
				<ParticipantDropdown
					{...defaultProps}
					hasNextPage={false}
					isFetchingNextPage={false}
					onLoadMore={onLoadMore}
				/>,
			);
			triggerScroll(document.querySelector(".max-h-60") as HTMLElement);
			expect(onLoadMore).not.toHaveBeenCalled();
		});

		it("isFetchingNextPage가 true이면 스크롤 바닥에 도달해도 onLoadMore가 호출되지 않는다", () => {
			const onLoadMore = jest.fn();
			render(
				<ParticipantDropdown
					{...defaultProps}
					hasNextPage={true}
					isFetchingNextPage={true}
					onLoadMore={onLoadMore}
				/>,
			);
			triggerScroll(document.querySelector(".max-h-60") as HTMLElement);
			expect(onLoadMore).not.toHaveBeenCalled();
		});
	});
});
