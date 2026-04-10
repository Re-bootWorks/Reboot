import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import ConnectBanner from ".";
import { connectQueryKeys } from "@/features/connect/queries";

const MOCK_HOT_POSTS = {
	data: [
		{
			id: 1,
			title: "주말 한강 러닝 같이 하실 분 구해요!",
			likeCount: 32,
			_count: { comments: 12 },
		},
		{ id: 2, title: "짧은글", likeCount: 28, _count: { comments: 9 } },
		{
			id: 3,
			title:
				"엄청긴글엄청긴글엄청긴글엄청긴글엄청긴글엄청긴글엄청긴글엄청긴글엄청긴글엄청긴글엄청긴글엄청긴글엄청긴글엄청긴글엄청긴글",
			likeCount: 21,
			_count: { comments: 15 },
		},
		{ id: 4, title: "맛집 같이 탐방할 팀원 구합니다", likeCount: 19, _count: { comments: 7 } },
		{ id: 5, title: "온라인 코딩 스터디 모집합니다!", likeCount: 17, _count: { comments: 5 } },
	],
};

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

const meta: Meta<typeof ConnectBanner> = {
	title: "Features/connect/Banner",
	component: ConnectBanner,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"커넥트 페이지 상단 배너. 타이핑 애니메이션, marquee 태그, HOT 게시글 슬라이드로 구성됩니다.",
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	decorators: [
		(Story) => {
			const queryClient = createQueryClient();
			queryClient.setQueryData(connectQueryKeys.hotPosts(), MOCK_HOT_POSTS);

			return (
				<QueryClientProvider client={queryClient}>
					<Suspense
						fallback={
							<div className="h-48 w-full animate-pulse rounded-3xl bg-purple-100 md:h-[244px]" />
						}>
						<Story />
					</Suspense>
				</QueryClientProvider>
			);
		},
	],
};

export const Empty: Story = {
	decorators: [
		(Story) => {
			const queryClient = createQueryClient();
			queryClient.setQueryData(connectQueryKeys.hotPosts(), { data: [] });

			return (
				<QueryClientProvider client={queryClient}>
					<Suspense
						fallback={
							<div className="h-48 w-full animate-pulse rounded-3xl bg-purple-100 md:h-[244px]" />
						}>
						<Story />
					</Suspense>
				</QueryClientProvider>
			);
		},
	],
};
