import ReviewCard from "./ReviewCard";
import { REVIEW_CARD_MOCK_DATA } from "../../mockData";
import Image from "next/image";

const EMPTY_IMAGE_SRC = "/assets/img/img_empty.svg";

export default function ReviewsSection() {
	const hasReviews = REVIEW_CARD_MOCK_DATA.length > 0;
	// 아래로 변경 예정
	// const hasReviews = (response?.data?.length ?? 0) > 0;

	return (
		<section className="rounded-3xl bg-white p-6 md:rounded-4xl md:p-8">
			{hasReviews ? (
				<div className="flex flex-col gap-4 md:gap-8">
					{REVIEW_CARD_MOCK_DATA.map((review, index) => (
						<ReviewCard key={index} {...review} />
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center gap-5 py-10 md:gap-6 md:py-14 lg:py-15">
					<Image
						src={EMPTY_IMAGE_SRC}
						alt=""
						aria-hidden="true"
						width={224}
						height={144}
						className="h-[4.438rem] w-30"
					/>
					<p className="text-sm font-medium text-gray-500 md:text-base">아직 리뷰가 없어요</p>
				</div>
			)}
		</section>
	);
}
