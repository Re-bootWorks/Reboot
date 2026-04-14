import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/getQueryClient";
import EditPostContainer from "@/features/connect/containers/EditPostContainer";
import { getPostDetailServer } from "@/features/connect/apis/getPostDetailServer";
import { connectQueryKeys } from "@/features/connect/queries";
import QueryErrorBoundary from "@/components/common/QueryErrorBoundary";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id: strId } = await params;
	const id = Number(strId);

	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: connectQueryKeys.detail(id),
		queryFn: () => getPostDetailServer(id),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<QueryErrorBoundary prefix="게시글을">
				<EditPostContainer id={id} />
			</QueryErrorBoundary>
		</HydrationBoundary>
	);
}
