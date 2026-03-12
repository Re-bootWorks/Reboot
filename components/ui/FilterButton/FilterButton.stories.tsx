import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FilterButton } from "@/components/ui/FilterButton";

const meta = {
	// Storybook 사이트의 사이드바에 표시되는 제목
	title: "UI/FilterButton",
	// 스토리북에서 사용할 컴포넌트
	component: FilterButton,
	// 컴포넌트가 표시되는 위치
	parameters: {
		layout: "centered",
	},
	// 컴포넌트 문서 자동 생성
	tags: ["autodocs"],
} satisfies Meta<typeof FilterButton>;

// meta 내보내기
export default meta;
type Story = StoryObj<typeof meta>;

// 스토리 작성
// 기본 필터 (비활성)
export const Default: Story = {
	// props 값 입력
	args: {
		label: "최신순",
		isActive: false,
		onClick: () => console.log("Filter clicked"),
	},
};

// 활성화된 필터
export const Active: Story = {
	args: {
		label: "최신순",
		isActive: true,
		onClick: () => console.log("Filter clicked"),
	},
};

// 여러 필터 버튼 예시
export const MultipleFilters: Story = {
	args: {
		label: "최신순",
		isActive: true,
		onClick: () => console.log("최신순"),
	},
	render: () => (
		<div className="flex w-full gap-4">
			<FilterButton label="최신순" isActive={true} onClick={() => console.log("최신순")} />
			<FilterButton label="마감 임박" isActive={false} onClick={() => console.log("마감 임박")} />
			<FilterButton label="인기순" isActive={false} onClick={() => console.log("인기순")} />
		</div>
	),
};
