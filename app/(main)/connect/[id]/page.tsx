import { getPostDetailServer } from "@/features/connect/apis/getPostDetailServer";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PostDetailContainer from "@/features/connect/containers/PostDetailContainer";

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const numId = Number(id);
	const queryClient = new QueryClient();

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ["postDetail", numId],
			queryFn: () => getPostDetailServer(numId),
		}),
		queryClient.prefetchQuery({
			queryKey: ["postComments", numId],
			queryFn: () => getPostDetailServer(numId),
		}),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PostDetailContainer id={numId} />
		</HydrationBoundary>
	);
}
