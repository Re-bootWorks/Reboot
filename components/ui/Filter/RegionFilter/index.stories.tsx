import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import RegionFilter from "./index";

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
		const [region, setRegion] = useState("");
		const [district, setDistrict] = useState("");

		return (
			<div className="flex min-h-screen w-full items-center justify-center">
				<RegionFilter
					value={{ region, district }}
					onChange={(r, d) => {
						setRegion(r);
						setDistrict(d);
					}}
				/>
			</div>
		);
	},
};
