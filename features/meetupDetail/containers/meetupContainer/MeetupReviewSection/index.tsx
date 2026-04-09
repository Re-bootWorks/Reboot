import { useCursorPagination } from "@/hooks/useCursorPagination";
import { useReviews } from "@/features/meetupDetail/queries";
import { useMemo } from "react";
import CommentCards, { CommentProps } from "@/features/meetupDetail/components/CommentCards";
import { sectionVariants } from "@/features/meetupDetail/animations";
import { motion } from "motion/react";

export default function MeetupReviewSection({ meetupId }: { meetupId: number }) {
	const { currentPage, currentCursor, handlePageChange } = useCursorPagination();
	const { data: reviewsData } = useReviews(meetupId, currentCursor);
	const hasMoreReviews = reviewsData.hasMore;

	const comments = useMemo<CommentProps[]>(
		() =>
			(reviewsData?.data ?? []).map((review) => ({
				id: review.id,
				score: review.score,
				comment: review.comment,
				createdAt: review.createdAt,
				user: review.user,
			})),
		[reviewsData],
	);

	return (
		<motion.section
			variants={sectionVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.1 }}
			className="mt-10 w-full md:mt-16 lg:mt-20">
			<CommentCards
				meetingId={meetupId}
				comments={comments}
				currentPage={currentPage}
				hasMore={hasMoreReviews}
				onPageChange={(page) => handlePageChange(page, reviewsData?.nextCursor, hasMoreReviews)}
			/>
		</motion.section>
	);
}
