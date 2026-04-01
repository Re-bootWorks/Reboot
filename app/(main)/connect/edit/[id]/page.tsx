import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import EditPostContainer from "@/features/connect/containers/EditPostContainer";
import { getPostDetailServer } from "@/features/connect/apis/getPostDetailServer";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id: strId } = await params;
	const id = Number(strId);

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["postDetail", id],
		queryFn: () => getPostDetailServer(id),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<EditPostContainer id={id} />
		</HydrationBoundary>
	);
}
