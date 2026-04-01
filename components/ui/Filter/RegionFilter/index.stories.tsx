import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import RegionFilter from "./index";
import { Option } from "./option";

const meta: Meta<typeof RegionFilter> = {
	title: "Filters/RegionFilter",
	component: RegionFilter,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;

type Story = StoryObj<typeof RegionFilter>;

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState<{
			region: Option | null;
			district: Option | null;
			fullLabel: string;
		}>({
			region: null,
			district: null,
			fullLabel: "",
		});

		return (
			<div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
				<RegionFilter
					value={{
						region: value.region,
						district: value.district,
					}}
					onChange={(data) => {
						console.log("선택값:", data);
						setValue(data);
					}}
				/>

				{/*  확인용 ui 입니다 */}
				<div className="text-center text-sm text-gray-700">
					<div>region: {value.region?.label ?? "없음"}</div>
					<div>district: {value.district?.label ?? "없음"}</div>
					<div className="font-bold text-purple-600">fullLabel: {value.fullLabel || "없음"}</div>
				</div>
			</div>
		);
	},
};
