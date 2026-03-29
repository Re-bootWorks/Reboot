import { Suspense } from "react";
import Container from "@/components/layout/Container";
import Banner from "@/features/meetup/list/components/Banner";
import ListFilters from "@/features/meetup/list/components/ListFilters";
import CreateOpenButton from "@/features/meetup/create/components/CreateOpenButton";
import MeetupCardList from "@/features/meetup/list/components/MeetupCardList";

export default function MeetupListPage() {
	return (
		<Container className="flex min-h-[calc(100vh-48px)] flex-col px-0 md:min-h-[calc(100vh-88px)] md:p-6 lg:p-0 lg:pt-[27px]">
			<Banner />
			<div className="mt-6 mb-10 flex flex-1 flex-col gap-y-5 px-4 md:mt-10 md:mb-12 md:gap-y-4 md:px-0 lg:mt-12 lg:mb-26 lg:gap-y-6">
				<Suspense fallback={null}>
					<ListFilters />
					<MeetupCardList />
				</Suspense>
			</div>
			<Suspense fallback={null}>
				<CreateOpenButton className="fixed right-4 bottom-6 md:right-5.5 md:bottom-5.5 lg:right-[85px] lg:bottom-14" />
			</Suspense>
		</Container>
	);
}
