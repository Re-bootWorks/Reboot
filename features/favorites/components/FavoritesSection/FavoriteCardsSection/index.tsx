"use client";

import Empty from "@/components/ui/Empty";
import GroupCard from "@/components/ui/GroupCard";
import LoaderDots from "@/components/ui/LoaderDots";
import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import FavoriteCard from "./FavoriteCard";
import {
	FavoritesListRequest,
	FavoriteCardItem,
	FavoriteCardItemSelected,
} from "@/features/favorites/types";
import { toOptionalNumber } from "@/features/favorites/utils";
import { useFavoritesInfiniteQuery } from "@/features/favorites/queries/infiniteQuery";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import useToggle from "@/hooks/useToggle";
import JoinModal from "../../JoinModal";
import { cn } from "@/utils/cn";

const size = 10;

export default function FavoriteCardsSection() {
	return (
		<ul className="mt-5 grid w-full content-start justify-items-stretch gap-4 md:mt-6 md:gap-6 lg:mt-8 lg:grid-cols-2">
			<Suspense fallback={<FavoriteCardSkeletonItems size={size} />}>
				<FavoriteCards />
			</Suspense>
		</ul>
	);
}

function FavoriteCards() {
	const searchParams = useSearchParams();

	const params: FavoritesListRequest = {
		type: searchParams.get("type") ?? undefined,
		region: searchParams.get("region") ?? undefined,
		dateStart: searchParams.get("dateStart") ?? undefined,
		dateEnd: searchParams.get("dateEnd") ?? undefined,
		sortBy: (searchParams.get("sortBy") as FavoritesListRequest["sortBy"]) ?? undefined,
		sortOrder: (searchParams.get("sortOrder") as FavoritesListRequest["sortOrder"]) ?? undefined,
		cursor: searchParams.get("cursor") ?? undefined,
		size: toOptionalNumber(searchParams.get("size")),
	};

	const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
		useFavoritesInfiniteQuery(params);
	const [selectedData, setSelectedData] = useState<FavoriteCardItemSelected>(null);
	const { isOpen, open, close } = useToggle();
	const loadMoreRef = useRef<HTMLDivElement>(null);

	useIntersectionObserver({
		targetRef: loadMoreRef,
		onIntersect: fetchNextPage,
		isEnabled: hasNextPage && !isFetchingNextPage,
	});

	return (
		<>
			<FavoriteCardsLoadedItems
				data={data ?? []}
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

			{!hasNextPage && data && data.length > 0 && <LastItem className="pb-6 md:pb-8" />}

			<JoinModal
				isOpen={isOpen}
				selectedData={selectedData}
				onClose={() => {
					setSelectedData(null);
					close();
				}}
			/>
		</>
	);
}

interface FavoriteCardsLoadedItemsProps {
	data: FavoriteCardItem[];
	setSelectedData: (data: FavoriteCardItemSelected) => void;
	openModalFn: () => void;
}

function FavoriteCardsLoadedItems({
	data,
	setSelectedData,
	openModalFn,
}: FavoriteCardsLoadedItemsProps) {
	if (data.length === 0) {
		return (
			<li className="col-span-full pt-31 md:pt-46">
				<Empty>아직 찜한 모임이 없어요</Empty>
			</li>
		);
	}

	return (
		<>
			{data.map((favorite) => (
				<li key={favorite.id} className="w-full">
					<FavoriteCard
						data={favorite}
						setSelectedData={setSelectedData}
						openModalFn={openModalFn}
					/>
				</li>
			))}
		</>
	);
}

function FavoriteCardSkeletonItems({ size }: { size: number }) {
	return Array.from({ length: size }).map((_, i) => (
		<li key={i} className="w-full">
			<GroupCard.Skeleton />
		</li>
	));
}

interface LastItemProps {
	ref?: React.RefObject<HTMLDivElement | null>;
	children?: React.ReactNode;
	className?: string;
}

function LastItem({ ref, children, className }: LastItemProps) {
	return (
		<li className={cn("col-span-full py-4", className)}>
			<div className="flex w-full items-center justify-center" ref={ref}>
				{children}
			</div>
		</li>
	);
}
