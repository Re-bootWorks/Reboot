import { Suspense } from "react";
import Container from "@/components/layout/Container";
import Banner from "@/features/meetup/list/components/Banner";
import ListFilters from "@/features/meetup/list/components/ListFilters";
import CreateOpenButton from "@/features/meetup/create/components/CreateOpenButton";
import MeetupCardList from "@/features/meetup/list/components/MeetupCardList";
import { MeetupListScrollProvider } from "@/features/meetup/list/providers/MeetupListScrollProvider";
import QueryErrorBoundary from "@/components/common/QueryErrorBoundary";
import { cn } from "@/utils/cn";

export default function MeetupListPage() {
	return (
		<MeetupListScrollProvider>
			<Container
				className={cn(
					"flex min-h-[calc(100vh-48px)] flex-col gap-y-5 px-0",
					"md:min-h-[calc(100vh-88px)] md:gap-y-4 md:p-6 lg:gap-y-6 lg:pt-[27px]",
				)}>
				<Banner />
				<Suspense fallback={null}>
					<ListFilters className={cn("mx-0 bg-gray-50 px-6 py-2", "md:-mx-4 md:px-6")} />
				</Suspense>
				<Suspense fallback={null}>
					<QueryErrorBoundary prefix="모임 목록을 ">
						<MeetupCardList className={cn("mb-10 flex-1 px-4", "md:mb-12 md:px-0 lg:mb-26")} />
					</QueryErrorBoundary>
				</Suspense>
				<Suspense fallback={null}>
					<CreateOpenButton
						className={cn(
							"fixed right-4 bottom-6",
							"md:right-5.5 md:bottom-5.5 lg:right-[85px] lg:bottom-14",
						)}
					/>
				</Suspense>
			</Container>
		</MeetupListScrollProvider>
	);
}
