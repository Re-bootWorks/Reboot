"use client";

import { Rating } from "@smastrom/react-rating";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/utils/cn";
import { RATING_STYLE } from "@/constants/ratingStyle";
import { useReviewsCategoriesStatistics, useReviewsStatistics } from "../../queries/queries";
import { ReviewCategoryStatistics } from "../../types";

const myStyles = {
	itemShapes: RATING_STYLE.itemShapes,
	activeFillColor: RATING_STYLE.activeFillColor,
	inactiveFillColor: "#F6F7F9",
};

type Props = {
	type?: string;
};

function getSelectedCategoryStats(
	statistics: ReviewCategoryStatistics | undefined,
	selectedType?: string,
) {
	if (!statistics) return null;
	if (!selectedType) return null;

	return statistics.find((item) => item.type === selectedType) ?? null;
}

export default function RatingSummary({ type }: Props) {
	const { data } = useReviewsStatistics();
	const { data: categoriesStatistics } = useReviewsCategoriesStatistics();

	const selectedStats = getSelectedCategoryStats(categoriesStatistics, type);

	const averageScore = selectedStats?.averageScore ?? data?.averageScore ?? 0;
	const totalReviews = selectedStats?.totalReviews ?? data?.totalReviews ?? 0;

	// 카테고리 통계 API에는 별점 분포 데이터(oneStar~fiveStars)가 없음
	// type 선택 시 우선 분포 영역은 전체 통계 데이터를 그대로 사용 -> 추후 수정 가능성 있음
	const oneStar = data?.oneStar ?? 0;
	const twoStars = data?.twoStars ?? 0;
	const threeStars = data?.threeStars ?? 0;
	const fourStars = data?.fourStars ?? 0;
	const fiveStars = data?.fiveStars ?? 0;

	const safeAverageScore = totalReviews > 0 ? averageScore : 0;
	const displayAverageScore = Number(safeAverageScore).toFixed(1);
	const hasReviews = totalReviews > 0;

	const starCounts: [number, number, number, number, number] = [
		oneStar,
		twoStars,
		threeStars,
		fourStars,
		fiveStars,
	];

	const ratingItems = [5, 4, 3, 2, 1].map((score) => ({
		label: `${score}점`,
		count: starCounts[score - 1],
	}));

	const maxCount = Math.max(...starCounts);

	return (
		<section
			aria-labelledby="review-summary-heading"
			className={cn(
				"bg-gradient-purple-200-lr w-full rounded-3xl border border-purple-400 px-[1.188rem] py-6 md:rounded-4xl md:px-6 md:py-[2.563rem]",
				"my-4 md:my-6 lg:mt-8 lg:mb-6",
			)}>
			<h2 id="review-summary-heading" className="sr-only">
				리뷰 평점 요약
			</h2>

			<div className="mx-auto flex items-center justify-center">
				<div className="flex w-full max-w-[7.938rem] flex-col items-center justify-center md:max-w-49.5">
					<div className="flex flex-col items-center justify-center gap-2">
						<p className="md:text-headline-md text-2xl font-bold text-gray-900">
							{displayAverageScore}
						</p>

						<Rating
							value={safeAverageScore}
							readOnly
							itemStyles={myStyles}
							className="max-w-25 md:max-w-47.5"
						/>
					</div>

					{hasReviews ? (
						<p className="text-xs text-gray-600 md:text-base">(총 {totalReviews}명 참여)</p>
					) : null}
				</div>

				<div
					aria-hidden="true"
					className="mx-4 w-px self-stretch border-0 bg-purple-50 md:mx-6 lg:mx-35.5"
				/>

				<ul className="grid w-full max-w-36 gap-0.5 md:max-w-[20.813rem] md:gap-2">
					{ratingItems.map((item) => {
						const isHighlighted = hasReviews && item.count === maxCount && maxCount > 0;

						return (
							<li key={item.label} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2">
								<span
									className={cn(
										"text-xs font-medium whitespace-nowrap md:text-sm",
										isHighlighted ? "text-purple-600" : "text-gray-600",
									)}>
									{item.label}
								</span>

								<ProgressBar
									max={totalReviews}
									current={item.count}
									className="h-1.5 w-full md:h-2"
								/>

								<span
									className={cn(
										"w-[2ch] text-center text-xs font-medium whitespace-nowrap tabular-nums md:text-start md:text-sm",
										isHighlighted ? "text-purple-600" : "text-gray-600",
									)}>
									{item.count}
								</span>
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
