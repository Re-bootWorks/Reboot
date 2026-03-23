import { Heart, Rating } from "@smastrom/react-rating";
import { RatingSummaryProps } from "../../types";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/utils/cn";

export default function RatingSummary({
	averageScore,
	totalReviews,
	oneStar,
	twoStars,
	threeStars,
	fourStars,
	fiveStars,
}: RatingSummaryProps) {
	const myStyles = {
		itemShapes: Heart,
		activeFillColor: "#7566E5",
		inactiveFillColor: "#F6F7F9",
	};

	const ratingItems = [
		{ label: "5점", count: fiveStars ?? 0 },
		{ label: "4점", count: fourStars ?? 0 },
		{ label: "3점", count: threeStars ?? 0 },
		{ label: "2점", count: twoStars ?? 0 },
		{ label: "1점", count: oneStar ?? 0 },
	];

	return (
		<section
			aria-labelledby="review-summary-heading"
			className="bg-gradient-purple-200-lr w-full rounded-3xl border border-purple-400 px-[1.188rem] py-6 md:rounded-4xl md:px-6 md:py-[2.563rem]">
			<h2 id="review-summary-heading" className="sr-only">
				리뷰 평점 요약
			</h2>

			{/* 이너 */}
			<div className="mx-auto flex items-center justify-center">
				{/* 이너 왼쪽 */}
				<div className="flex w-full max-w-[7.938rem] flex-col items-center justify-center md:max-w-49.5">
					{/* 평균 별점 + 별점 아이콘 */}
					<div className="flex flex-col items-center justify-center gap-2">
						<p className="md:text-headline-md text-2xl font-bold text-gray-900">{averageScore}</p>
						<Rating
							value={averageScore}
							readOnly
							itemStyles={myStyles}
							className="max-w-25 md:max-w-47.5"
						/>
					</div>
					<p className="text-xs text-gray-600 md:text-base">(총 {totalReviews}명 참여)</p>
				</div>

				<div
					aria-hidden="true"
					className="mx-4 w-px self-stretch border-0 bg-purple-50 md:mx-6 lg:mx-35.5"
				/>

				{/* 이너 오른쪽 */}
				<ul className="grid w-full max-w-36 gap-0.5 md:max-w-[20.813rem] md:gap-2">
					{ratingItems.map((item, index) => {
						const isFirst = index === 0;

						return (
							<li key={item.label} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2">
								<span
									className={cn(
										"text-xs font-medium whitespace-nowrap md:text-sm",
										isFirst ? "text-purple-600" : "text-gray-600",
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
										isFirst ? "text-purple-600" : "text-gray-600",
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
