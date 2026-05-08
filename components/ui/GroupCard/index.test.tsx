import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GroupCard from ".";

const joinButtonText = "참여하기";
const cancelButtonText = "참여 취소";
const likeButtonLabel = "찜 하기";
const unlikeButtonLabel = "찜 취소";
const ribbonText = "참여 모임";
const regClosedText = "모집 마감";
const completedText = "모임 완료";
const confirmedText = "개설 확정";

const mockId = 1;
const mockHref = "/meetup/1";
const mockImageSrc = "https://example.com/img.jpg";
const mockImageAlt = "모임 이미지";
const mockName = "오피스 스트레칭";
const mockRegion = "을지로 3가";
const mockType = "운동/건강";
const mockDate = "1월 7일";
const mockTime = "17:30";
const mockDeadlineText = "오늘 21시 마감";
const mockCapacity = 20;
const mockParticipantCount = 12;
const defaultStatus = {
	isConfirmed: false,
	isRegClosed: false,
	isLiked: false,
	isJoined: false,
	isCompleted: false,
};

jest.mock("next/image", () => {
	type MockImageProps = React.ImgHTMLAttributes<HTMLImageElement>;
	return function MockImage(props: MockImageProps) {
		return <img {...props} />;
	};
});

jest.mock("next/link", () => {
	type MockLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
	return function MockLink({ href, children, ...props }: MockLinkProps) {
		return (
			<a href={href} {...props}>
				{children}
			</a>
		);
	};
});

function renderFullCard(
	statusOverrides: Partial<typeof defaultStatus> = {},
	onClick = jest.fn(),
	onLike = jest.fn(),
) {
	const status = { ...defaultStatus, ...statusOverrides };
	return render(
		<GroupCard id={mockId} href={mockHref} status={status}>
			<GroupCard.Image src={mockImageSrc} alt={mockImageAlt} />
			<GroupCard.Content>
				<GroupCard.Title name={mockName} />
				<GroupCard.SubTitle region={mockRegion} type={mockType} />
				<GroupCard.BadgeGroup date={mockDate} time={mockTime} deadlineText={mockDeadlineText} />
				<GroupCard.ParticipantBar capacity={mockCapacity} participantCount={mockParticipantCount} />
				<GroupCard.JoinButton onClick={onClick} />
				<GroupCard.LikeButton onClick={onLike} />
			</GroupCard.Content>
		</GroupCard>,
	);
}

describe("GroupCard 컴포넌트 테스트", () => {
	test("isJoined가 true이면 참여 리본이 표시되어야 함", () => {
		renderFullCard({ isJoined: true });

		expect(screen.getByText(ribbonText)).toBeInTheDocument();
	});

	test("isJoined가 false이면 참여 리본이 표시되지 않아야 함", () => {
		renderFullCard({ isJoined: false });

		expect(screen.queryByText(ribbonText)).not.toBeInTheDocument();
	});
});

describe("GroupCard.Image 테스트", () => {
	test("이미지가 렌더링되어야 함", () => {
		renderFullCard();

		expect(screen.getByAltText(mockImageAlt)).toBeInTheDocument();
	});

	test("isRegClosed가 true이면 '모집 마감' 오버레이가 표시되어야 함", () => {
		renderFullCard({ isRegClosed: true });

		expect(screen.getByText(regClosedText)).toBeInTheDocument();
	});

	test("isCompleted가 true이면 '모임 완료' 오버레이가 표시되어야 함", () => {
		renderFullCard({ isRegClosed: true, isCompleted: true });

		expect(screen.getByText(completedText)).toBeInTheDocument();
	});

	test("isRegClosed가 false이면 오버레이가 표시되지 않아야 함", () => {
		renderFullCard({ isRegClosed: false });

		expect(screen.queryByText(regClosedText)).not.toBeInTheDocument();
		expect(screen.queryByText(completedText)).not.toBeInTheDocument();
	});
});

describe("GroupCard.Title 테스트", () => {
	test("모임 이름이 렌더링되어야 함", () => {
		renderFullCard();

		expect(screen.getByText(mockName)).toBeInTheDocument();
	});

	test("isConfirmed가 true이면 '개설 확정' 레이블이 표시되어야 함", () => {
		renderFullCard({ isConfirmed: true });

		expect(screen.getByText(confirmedText)).toBeInTheDocument();
	});

	test("isConfirmed가 false이면 '개설 확정' 레이블이 표시되지 않아야 함", () => {
		renderFullCard({ isConfirmed: false });

		expect(screen.queryByText(confirmedText)).not.toBeInTheDocument();
	});
});

describe("GroupCard.SubTitle 테스트", () => {
	test("지역과 모임 종류가 렌더링되어야 함", () => {
		renderFullCard();

		expect(screen.getByText(mockRegion)).toBeInTheDocument();
		expect(screen.getByText(mockType)).toBeInTheDocument();
	});
});

describe("GroupCard.BadgeGroup 테스트", () => {
	test("날짜, 시간, 마감 텍스트가 렌더링되어야 함", () => {
		renderFullCard();

		expect(screen.getByText(mockDate)).toBeInTheDocument();
		expect(screen.getByText(mockTime)).toBeInTheDocument();
		expect(screen.getByText(mockDeadlineText)).toBeInTheDocument();
	});

	test("deadlineText가 없으면 마감 태그가 렌더링되지 않아야 함", () => {
		render(
			<GroupCard id={mockId} href={mockHref} status={defaultStatus}>
				<GroupCard.Content>
					<GroupCard.BadgeGroup date={mockDate} time={mockTime} />
				</GroupCard.Content>
			</GroupCard>,
		);

		expect(screen.getByText(mockDate)).toBeInTheDocument();
		expect(screen.queryByText(mockDeadlineText)).not.toBeInTheDocument();
	});
});

describe("GroupCard.ParticipantBar 테스트", () => {
	test("참여 인원과 정원이 렌더링되어야 함", () => {
		renderFullCard();

		expect(screen.getByText(String(mockParticipantCount))).toBeInTheDocument();
		expect(screen.getByText(String(mockCapacity))).toBeInTheDocument();
	});
});

describe("GroupCard.JoinButton 테스트", () => {
	test("미참여 상태에서 '참여하기' 버튼이 렌더링되어야 함", () => {
		renderFullCard({ isJoined: false });

		expect(screen.getByText(joinButtonText)).toBeInTheDocument();
	});

	test("참여 상태에서 '참여 취소' 버튼이 렌더링되어야 함", () => {
		renderFullCard({ isJoined: true });

		expect(screen.getByText(cancelButtonText)).toBeInTheDocument();
	});

	test("클릭 시 onClick이 호출되어야 함", async () => {
		const onClick = jest.fn();
		const user = userEvent.setup();
		renderFullCard({ isJoined: false }, onClick);

		await user.click(screen.getByText(joinButtonText));

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	test("isRegClosed가 true이고 미참여이면 버튼이 비활성화되어야 함", () => {
		renderFullCard({ isRegClosed: true, isJoined: false });

		expect(screen.getByText(joinButtonText)).toBeDisabled();
	});

	test("isCompleted가 true이면 버튼이 렌더링되지 않아야 함", () => {
		renderFullCard({ isCompleted: true });

		expect(screen.queryByText(joinButtonText)).not.toBeInTheDocument();
		expect(screen.queryByText(cancelButtonText)).not.toBeInTheDocument();
	});

	test("isRegClosed가 true이지만 참여 상태이면 '참여 취소' 버튼이 활성화되어야 함", () => {
		renderFullCard({ isRegClosed: true, isJoined: true });

		expect(screen.getByText(cancelButtonText)).toBeEnabled();
	});
});

describe("GroupCard.LikeButton 테스트", () => {
	test("찜 안 한 상태에서 '찜 하기' 버튼이 렌더링되어야 함", () => {
		renderFullCard({ isLiked: false });

		expect(screen.getByRole("button", { name: likeButtonLabel })).toBeInTheDocument();
	});

	test("찜한 상태에서 '찜 취소' 버튼이 렌더링되어야 함", () => {
		renderFullCard({ isLiked: true });

		expect(screen.getByRole("button", { name: unlikeButtonLabel })).toBeInTheDocument();
	});

	test("클릭 시 onClick이 호출되어야 함", async () => {
		const onLike = jest.fn();
		const user = userEvent.setup();
		renderFullCard({}, jest.fn(), onLike);

		await user.click(screen.getByRole("button", { name: likeButtonLabel }));

		expect(onLike).toHaveBeenCalledTimes(1);
	});
});
