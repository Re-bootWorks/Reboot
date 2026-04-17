import { Suspense } from "react";
import { Metadata } from "next";
import { cn } from "@/utils/cn";
import Container from "@/components/layout/Container";
import QueryErrorBoundary from "@/components/common/QueryErrorBoundary";
import Banner from "@/features/meetup/list/components/Banner";
import { MeetupListScrollProvider } from "@/features/meetup/list/providers/MeetupListScrollProvider";
import ListFilters from "@/features/meetup/list/components/ListFilters";
import ListFiltersSkeleton from "@/features/meetup/list/components/ListFilters/ListFiltersSkeleton";
import MeetupCardList from "@/features/meetup/list/components/MeetupCardList";
import MeetupCardListSkeleton from "@/features/meetup/list/components/MeetupCardList/MeetupCardListSkeleton";
import CreateOpenButton from "@/features/meetup/create/components/CreateOpenButton";

export const metadata: Metadata = {
	title: "모임 찾기",
	robots: {
		index: true,
		follow: true,
	},
};

const size = 10;

export default function MeetupListPage() {
	return (
		<MeetupListScrollProvider>
			<Container
				className={cn(
					"flex min-h-[calc(100vh-48px)] flex-col gap-y-5 px-0",
					"md:min-h-[calc(100vh-88px)] md:gap-y-4 md:p-6 lg:gap-y-6 lg:pt-7",
				)}>
				<Banner />
				<Suspense fallback={<ListFiltersSkeleton className={ListFiltersStyle} />}>
					<ListFilters className={ListFiltersStyle} />
				</Suspense>
				<ul
					className={cn(
						"grid w-full content-start justify-items-stretch gap-4 transition-opacity duration-200 ease-in-out md:gap-6 lg:grid-cols-2",
						"mb-10 flex-1 px-4",
						"md:mb-12 md:px-0 lg:mb-26",
					)}>
					<Suspense fallback={<MeetupCardListSkeleton size={size} />}>
						<QueryErrorBoundary prefix="모임 목록을 ">
							<MeetupCardList size={size} />
						</QueryErrorBoundary>
					</Suspense>
				</ul>
				<Suspense fallback={null}>
					<CreateOpenButton className="fixed right-6 bottom-6 z-10" />
				</Suspense>
			</Container>
		</MeetupListScrollProvider>
	);
}

const ListFiltersStyle = "mx-0 bg-gray-50 px-6 py-2 md:-mx-4 md:px-6";
