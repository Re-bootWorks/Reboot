import { getPostDetailServer } from "@/features/connect/apis/getPostDetailServer";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PostDetailContainer from "@/features/connect/containers/PostDetailContainer";

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["postDetail", id],
		queryFn: () => getPostDetailServer(id),
	});

	const data = await getPostDetailServer(id);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PostDetailContainer id={id} />
		</HydrationBoundary>
	);
}
