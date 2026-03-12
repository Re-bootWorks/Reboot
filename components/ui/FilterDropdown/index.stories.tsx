import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FilterDropdown } from "@/components/ui/FilterDropdown";

const meta = {
	title: "UI/FilterDropdown",
	component: FilterDropdown,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof FilterDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 드롭다운
export const Default: Story = {
	args: {
		label: "날짜 전체",
		options: ["전체", "오늘", "이번주", "이번달"],
		onChange: (value: string) => console.log("선택:", value),
	},
};

// 지역 필터 예시
export const RegionFilter: Story = {
	args: {
		label: "지역 전체",
		options: ["전체", "서울", "부산", "대구", "인천"],
		onChange: (value: string) => console.log("지역:", value),
	},
};

// 여러 필터 UI 예시
export const MultipleDropdowns: Story = {
	args: {
		label: "날짜 전체",
		options: ["전체", "오늘"],
	},

	render: () => (
		<div className="flex gap-6">
			<FilterDropdown
				label="날짜 전체"
				options={["전체", "오늘", "이번주", "이번달"]}
				onChange={(v) => console.log("날짜:", v)}
			/>

			<FilterDropdown
				label="지역 전체"
				options={["전체", "서울", "부산", "대구"]}
				onChange={(v) => console.log("지역:", v)}
			/>
		</div>
	),
};
