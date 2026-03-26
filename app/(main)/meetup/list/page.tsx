import Container from "@/components/layout/Container";
import Banner from "@/features/meetup/list/components/Banner";
import ListFilters from "@/features/meetup/list/components/ListFilters";
import MeetupCard from "@/features/meetup/list/components/MeetupCard";
import { MOCK_MEETUP_DATA } from "@/features/meetup/list/constants/mock";

export default function MeetupList() {
	return (
		<Container className="md:p-6 lg:p-0 lg:pt-[27px]">
			<Banner />
			<div className="my-12 flex flex-col gap-y-5 px-4 md:gap-y-4 md:px-0 lg:gap-y-6">
				<ListFilters />
				<ul className="grid gap-4 md:gap-6 lg:grid-cols-2">
					{MOCK_MEETUP_DATA.map((item) => (
						<li key={item.id}>
							<MeetupCard data={item} />
						</li>
					))}
				</ul>
			</div>
		</Container>
	);
}
