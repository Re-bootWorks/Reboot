import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import EditPostContainer from "@/features/connect/containers/EditPostContainer";
import { getPostDetailServer } from "@/features/connect/apis/getPostDetailServer";
import { ErrorBoundary } from "react-error-boundary";
import ConnectErrorFallback from "@/features/connect/components/ErrorBoundary";
import { connectQueryKeys } from "@/features/connect/queries";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id: strId } = await params;
	const id = Number(strId);

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: connectQueryKeys.detail(id),
		queryFn: () => getPostDetailServer(id),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ErrorBoundary FallbackComponent={ConnectErrorFallback}>
				<EditPostContainer id={id} />
			</ErrorBoundary>
		</HydrationBoundary>
	);
}
