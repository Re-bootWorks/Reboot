import CategoryTabs from "./CategoryTabs";
import Filters from "./Filters";

export default function ListControls() {
	return (
		<section
			aria-labelledby="review-filter-heading"
			className="flex flex-col items-start gap-2 px-1 md:gap-4 md:px-2 lg:flex-row lg:items-center lg:justify-between">
			<h2 id="review-filter-heading" className="sr-only">
				리뷰 필터
			</h2>
			<CategoryTabs />
			<Filters />
		</section>
	);
}
