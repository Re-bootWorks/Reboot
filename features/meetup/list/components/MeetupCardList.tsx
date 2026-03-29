"use client";

import MeetupCard from "@/features/meetup/list/components/MeetupCard";
import { useGetMeetups } from "@/features/meetup/queries";
import { useQueryParams } from "@/hooks/useQueryParams";
import { QUERY_KEYS } from "../constants";
import { transformQueryValue, transformTypeValue } from "../../utils";
import { SortBy, SortOrder } from "../../types";
import GroupCard from "@/components/ui/GroupCard";
import { Meeting } from "../types";

export default function MeetupCardList() {
	const { get } = useQueryParams();
	const size = 10;
	const { data, error, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetMeetups({
		type: transformTypeValue(get(QUERY_KEYS.TYPE)),
		region: transformQueryValue(get(QUERY_KEYS.REGION)),
		date: transformQueryValue(get(QUERY_KEYS.DATE)),
		sortBy: transformQueryValue<SortBy>(get(QUERY_KEYS.SORT_BY) as SortBy | null),
		sortOrder: transformQueryValue<SortOrder>(get(QUERY_KEYS.SORT_ORDER) as SortOrder | null),
		size,
	});

	return (
		<ul className="grid justify-items-stretch gap-4 md:gap-6 lg:grid-cols-2">
			{isLoading ? (
				<MeetupCardSkeletonList size={size} />
			) : (
				<>
					<MeetupCardLoadedList data={data?.pages.flatMap((page) => page.data)} />
					{isFetchingNextPage && <MeetupCardSkeletonList size={size} />}
				</>
			)}
			{/* TODO: intersection observer 적용, 스타일링 */}
			{hasNextPage && (
				<li className="col-span-full">
					<button type="button" className="w-full cursor-pointer" onClick={() => fetchNextPage()}>
						{isFetchingNextPage ? "로딩 중..." : "더 보기"}
					</button>
				</li>
			)}
			{error && <div>에러가 발생했습니다.</div>}
		</ul>
	);
}

function MeetupCardLoadedList({ data }: { data: Meeting[] | undefined }) {
	return data?.map((item) => (
		<li key={item.id} className="w-full">
			<MeetupCard data={item} />
		</li>
	));
}

function MeetupCardSkeletonList({ size }: { size: number }) {
	return Array.from({ length: size }).map((_, i) => (
		<li key={i} className="w-full">
			<GroupCard.Skeleton />
		</li>
	));
}
