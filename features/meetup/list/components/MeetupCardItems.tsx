"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGetMeetups } from "@/features/meetup/queries";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { QUERY_KEYS } from "../constants";
import { MeetupItem } from "../types";
import {
	transformQueryValue,
	transformTypeValue,
	transformSortByQuery,
	transformSortOrderQuery,
	transformDateStartQuery,
	transformDateEndQuery,
} from "../utils";
import MeetupCard from "@/features/meetup/list/components/MeetupCard";
import GroupCard from "@/components/ui/GroupCard";
import LoaderDots from "@/components/ui/LoaderDots";
import Empty from "./Emtpy";

export default function MeetupCardItems({ size }: { size: number }) {
	const { get } = useQueryParams();
	const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetMeetups({
		type: transformTypeValue(get(QUERY_KEYS.TYPE)),
		region: transformQueryValue(get(QUERY_KEYS.REGION)),
		dateStart: transformDateStartQuery(get(QUERY_KEYS.DATE_START)),
		dateEnd: transformDateEndQuery(get(QUERY_KEYS.DATE_END)),
		sortBy: transformSortByQuery(get(QUERY_KEYS.SORT_BY)),
		sortOrder: transformSortOrderQuery(get(QUERY_KEYS.SORT_ORDER)),
		size,
	});
	const loadMoreRef = useRef<HTMLDivElement>(null);
	useIntersectionObserver({
		targetRef: loadMoreRef,
		onIntersect: fetchNextPage,
		isEnabled: hasNextPage && !isFetchingNextPage,
	});

	return (
		<>
			<MeetupCardLoadedItems data={data?.pages?.flatMap((page) => page?.data) ?? []} />
			{hasNextPage &&
				(isFetchingNextPage ? (
					<LastItem>
						<LoaderDots size="xl" className="fill-gray-600" />
					</LastItem>
				) : (
					<LastItem ref={loadMoreRef} />
				))}
			{/* {error && <LastItem>에러가 발생했습니다.</LastItem>} */}
		</>
	);
}

function MeetupCardLoadedItems({ data }: { data: MeetupItem[] | undefined }) {
	if (data?.length === 0) {
		return <Empty />;
	}
	return (
		<AnimatePresence mode="popLayout">
			{data?.map((item, i) => (
				<motion.li
					key={item.id}
					className="w-full"
					variants={cardVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					custom={i % 10}>
					<MeetupCard data={item} />
				</motion.li>
			))}
		</AnimatePresence>
	);
}
const cardVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * 0.05,
			duration: 0.3,
			ease: "easeOut" as const,
		},
	}),
	exit: {
		opacity: 0,
		transition: {
			duration: 0.3,
			ease: "easeOut" as const,
		},
	},
};

export function MeetupCardSkeletonItems({ size }: { size: number }) {
	return Array.from({ length: size }).map((_, i) => (
		<li key={i} className="w-full">
			<GroupCard.Skeleton />
		</li>
	));
}

interface LastItemProps {
	ref?: React.RefObject<HTMLDivElement | null>;
	children?: React.ReactNode;
}
function LastItem({ ref, children }: LastItemProps) {
	return (
		<li className="col-span-full py-4">
			<div className="flex w-full items-center justify-center" ref={ref}>
				{children}
			</div>
		</li>
	);
}
