import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import RatingSummary from ".";
import { RatingSummaryProps } from "../../types";

const meta: Meta<typeof RatingSummary> = {
	title: "Features/Reviews/RatingSummary",
	component: RatingSummary,
};

export default meta;

type Story = StoryObj<typeof RatingSummary>;

const BASE_ARGS: RatingSummaryProps = {
	averageScore: 4.5,
	totalReviews: 42,
	oneStar: 1,
	twoStars: 2,
	threeStars: 5,
	fourStars: 14,
	fiveStars: 20,
};

export const Default: Story = {
	args: BASE_ARGS,
};
