import PostDetailCardSkeleton from "@/features/connect/components/PostDetailCard/Skeleton";
import CommentSectionSkeleton from "@/features/connect/components/CommentSection/Skeleton";

export default function PostDetailSkeleton() {
	return (
		<div className="mx-auto mt-[4.5rem] max-w-3xl px-4">
			<div className="flex flex-col gap-6 md:gap-8">
				<PostDetailCardSkeleton />
				<CommentSectionSkeleton />
			</div>
		</div>
	);
}
