import ReviewCard from "./ReviewCard";
import { REVIEW_CARD_MOCK_DATA } from "../../mockData";
import Empty from "@/components/layout/Empty";

export default function ReviewsSection() {
	const hasReviews = REVIEW_CARD_MOCK_DATA.length > 0;
	// 아래로 변경 예정
	// const hasReviews = (response?.data?.length ?? 0) > 0;

	return (
		<section className="rounded-3xl bg-white p-6 md:rounded-4xl md:p-8">
			{hasReviews ? (
				<div className="flex flex-col gap-4 md:gap-8">
					{REVIEW_CARD_MOCK_DATA.map((review) => (
						<ReviewCard key={review.id} {...review} />
					))}
				</div>
			) : (
				<Empty>아직 리뷰가 없어요</Empty>
			)}
		</section>
	);
}
