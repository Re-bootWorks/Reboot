import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RatingSummary from ".";
import { queryKeys } from "../../queries/queryKeys";

const DEFAULT_STATISTICS = {
	averageScore: 4.5,
	totalReviews: 42,
	oneStar: 1,
	twoStars: 2,
	threeStars: 5,
	fourStars: 14,
	fiveStars: 20,
};

const DEFAULT_CATEGORIES_STATISTICS = [
	{
		type: "자기계발",
		averageScore: 5,
		totalReviews: 4,
	},
	{
		type: "여행",
		averageScore: 5,
		totalReviews: 3,
	},
	{
		type: "반려동물",
		averageScore: 3.7,
		totalReviews: 35,
	},
	{
		type: "기타",
		averageScore: 0,
		totalReviews: 0,
	},
	{
		type: "운동/스포츠",
		averageScore: 5,
		totalReviews: 2,
	},
];

const EMPTY_STATISTICS = {
	averageScore: 0,
	totalReviews: 0,
	oneStar: 0,
	twoStars: 0,
	threeStars: 0,
	fourStars: 0,
	fiveStars: 0,
};

const createQueryClient = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	return queryClient;
};

const meta: Meta<typeof RatingSummary> = {
	title: "Features/Reviews/RatingSummary",
	component: RatingSummary,
};

export default meta;

type Story = StoryObj<typeof RatingSummary>;

export const Default: Story = {
	decorators: [
		(Story) => {
			const queryClient = createQueryClient();

			queryClient.setQueryData(queryKeys.reviews.statistics, DEFAULT_STATISTICS);
			queryClient.setQueryData(
				queryKeys.reviews.categories.statistics,
				DEFAULT_CATEGORIES_STATISTICS,
			);

			return (
				<QueryClientProvider client={queryClient}>
					<Story />
				</QueryClientProvider>
			);
		},
	],
	args: {},
};

export const Category: Story = {
	decorators: [
		(Story) => {
			const queryClient = createQueryClient();

			queryClient.setQueryData(queryKeys.reviews.statistics, DEFAULT_STATISTICS);
			queryClient.setQueryData(
				queryKeys.reviews.categories.statistics,
				DEFAULT_CATEGORIES_STATISTICS,
			);

			return (
				<QueryClientProvider client={queryClient}>
					<Story />
				</QueryClientProvider>
			);
		},
	],
	args: {
		type: "자기계발",
	},
};

export const Empty: Story = {
	decorators: [
		(Story) => {
			const queryClient = createQueryClient();

			queryClient.setQueryData(queryKeys.reviews.statistics, EMPTY_STATISTICS);
			queryClient.setQueryData(queryKeys.reviews.categories.statistics, []);

			return (
				<QueryClientProvider client={queryClient}>
					<Story />
				</QueryClientProvider>
			);
		},
	],
	args: {},
};
