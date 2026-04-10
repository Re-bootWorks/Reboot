"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ErrorBoundary } from "react-error-boundary";
import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import type { MeetupItem, MeetupItemSelected, MeetupListResponse } from "../../../types";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import useToggle from "@/hooks/useToggle";
import MeetupCard from "@/features/meetup/list/components/MeetupCard";
import LoaderDots from "@/components/ui/LoaderDots";
import Empty from "@/components/ui/Empty";
import JoinModal from "../JoinModal";

interface MeetupCardItemsProps {
	query: UseInfiniteQueryResult<InfiniteData<MeetupListResponse>>;
}

export default function MeetupCardItems({ query }: MeetupCardItemsProps) {
	const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = query;
	const [selectedData, setSelectedData] = useState<MeetupItemSelected>(null);
	const { isOpen, open, close } = useToggle();

	const loadMoreRef = useRef<HTMLDivElement>(null);
	useIntersectionObserver({
		targetRef: loadMoreRef,
		onIntersect: fetchNextPage,
		isEnabled: hasNextPage && !isFetchingNextPage,
	});

	return (
		<ErrorBoundary fallbackRender={() => <LastItem>에러가 발생했습니다.</LastItem>}>
			<MeetupCardLoadedItems
				data={data?.pages?.flatMap((page) => page?.data) ?? []}
				setSelectedData={setSelectedData}
				openModalFn={open}
			/>
			{hasNextPage &&
				(isFetchingNextPage ? (
					<LastItem>
						<LoaderDots size="lg" />
					</LastItem>
				) : (
					<LastItem ref={loadMoreRef} />
				))}
			<JoinModal
				isOpen={isOpen}
				selectedData={selectedData}
				onClose={() => {
					setSelectedData(null);
					close();
				}}
			/>
		</ErrorBoundary>
	);
}

interface MeetupCardLoadedItemsProps {
	data: MeetupItem[] | undefined;
	setSelectedData: (data: MeetupItemSelected) => void;
	openModalFn: () => void;
}
function MeetupCardLoadedItems({ data, setSelectedData, openModalFn }: MeetupCardLoadedItemsProps) {
	if (data?.length === 0) {
		return (
			<Empty section>
				아직 모임이 없어요
				<br />
				지금 바로 모임을 만들어보세요!
			</Empty>
		);
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
					<MeetupCard data={item} setSelectedData={setSelectedData} openModalFn={openModalFn} />
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
