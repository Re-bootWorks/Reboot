import PostDetailCardSkeleton from "@/features/connect/components/PostDetailCard/Skeleton";
import CommentSectionSkeleton from "@/features/connect/components/CommentSection/Skeleton";
import Container from "@/components/layout/Container";

export default function ConnectDetailLoading() {
	return (
		<Container narrow className="mt-[4.5rem]">
			<div className="flex flex-col gap-6 md:gap-8">
				<PostDetailCardSkeleton />
				<CommentSectionSkeleton />
			</div>
		</Container>
	);
}
