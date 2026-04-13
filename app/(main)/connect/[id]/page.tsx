import { getPostDetailServer } from "@/features/connect/apis/getPostDetailServer";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/getQueryClient";
import PostDetailContainer from "@/features/connect/containers/PostDetailContainer";
import { ErrorBoundary } from "react-error-boundary";
import ConnectErrorFallback from "@/features/connect/components/ErrorBoundary";
import { connectQueryKeys } from "@/features/connect/queries";

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
			<ErrorBoundary FallbackComponent={ConnectErrorFallback}>
				<PostDetailContainer id={numId} />
			</ErrorBoundary>
		</HydrationBoundary>
	);
}
