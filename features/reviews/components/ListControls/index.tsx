import CategoryTabs from "./CategoryTabs";
import ListFilters from "./ListFilters";

export default function ListControls() {
	return (
		<section
			aria-labelledby="review-filter-heading"
			className="flex flex-col gap-2 px-1 md:gap-4 md:px-2 lg:ml-auto lg:flex-row lg:items-center [&>*:nth-child(3)]:self-start">
			<h2 id="review-filter-heading" className="sr-only">
				리뷰 필터
			</h2>
			<CategoryTabs />
			<ListFilters />
		</section>
	);
}
