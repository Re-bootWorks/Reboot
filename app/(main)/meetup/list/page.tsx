import { Suspense } from "react";
import Container from "@/components/layout/Container";
import Banner from "@/features/meetup/list/components/Banner";
import ListFilters from "@/features/meetup/list/components/ListFilters";
import MeetupCard from "@/features/meetup/list/components/MeetupCard";
import { MOCK_MEETUP_DATA } from "@/features/meetup/list/constants/mock";
import CreateOpenButton from "@/features/meetup/create/components/CreateOpenButton";

export default function MeetupList() {
	return (
		<Container className="px-0 md:p-6 lg:p-0 lg:pt-[27px]">
			<Banner />
			<div className="my-12 flex flex-col gap-y-5 px-4 md:gap-y-4 md:px-0 lg:gap-y-6">
				<Suspense fallback={<></>}>
					<ListFilters />
				</Suspense>
				<ul className="grid justify-items-stretch gap-4 md:gap-6 lg:grid-cols-2">
					{MOCK_MEETUP_DATA.map((item) => (
						<li key={item.id} className="w-full">
							<MeetupCard data={item} />
						</li>
					))}
				</ul>
			</div>
			<CreateOpenButton className="fixed right-4 bottom-6 md:right-5.5 md:bottom-5.5 lg:right-[85px] lg:bottom-14" />
		</Container>
	);
}
