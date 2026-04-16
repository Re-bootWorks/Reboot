import PageIntro from "@/components/ui/PageIntro";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import QueryErrorBoundary from "@/components/common/QueryErrorBoundary";
import { getQueryClient } from "@/libs/getQueryClient";
import { prefetchFavorites } from "@/features/favorites/queries/prefetchQueries";
import { FavoritesListRequest } from "@/features/favorites/types";
import FavoritesSection from "@/features/favorites/components/FavoritesSection";
import ListControls from "@/features/favorites/components/ListControls";
import { FavoritesListScrollProvider } from "@/features/favorites/components/providers/FavoritesListScrollProvider";

type Props = {
	searchParams: Promise<FavoritesListRequest>;
};

export default async function FavoritesPage({ searchParams }: Props) {
	const params = await searchParams;

	const queryClient = getQueryClient();

	const normalizedParams: FavoritesListRequest = {
		type: params.type,
		region: params.region,
		dateStart: params.dateStart,
		dateEnd: params.dateEnd,
		sortBy: params.sortBy,
		sortOrder: params.sortOrder,
		size: params.size,
	};

	await prefetchFavorites(queryClient, normalizedParams);

	return (
		<FavoritesListScrollProvider>
			<header className="mb-8 pt-8.5 md:mb-14 md:pt-10 lg:pt-[3.188rem]">
				<PageIntro />
			</header>

			<ListControls />

			<QueryErrorBoundary prefix="찜목록을 ">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<FavoritesSection />
				</HydrationBoundary>
			</QueryErrorBoundary>
		</FavoritesListScrollProvider>
	);
}
