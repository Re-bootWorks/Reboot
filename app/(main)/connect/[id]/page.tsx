import { getPostDetailServer } from "@/features/connect/apis/getPostDetailServer";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/getQueryClient";
import PostDetailContainer from "@/features/connect/containers/PostDetailContainer";
import { connectQueryKeys } from "@/features/connect/queries";
import QueryErrorBoundary from "@/components/common/QueryErrorBoundary";

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const numId = Number(id);
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: connectQueryKeys.detail(numId),
		queryFn: () => getPostDetailServer(numId),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<QueryErrorBoundary prefix="게시글을">
				<PostDetailContainer id={numId} />
			</QueryErrorBoundary>
		</HydrationBoundary>
	);
}
