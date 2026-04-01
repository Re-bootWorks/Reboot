import { cn } from "@/utils/cn";

type PaginationItemProps = {
	page: number | string;
	isActive?: boolean;
	handlePageClick?: () => void;
};

export default function PaginationItem({
	page,
	isActive = false,
	handlePageClick,
}: PaginationItemProps) {
	return (
		<button
			onClick={handlePageClick}
			className={cn(
				"flex items-center justify-center rounded-lg transition-colors",
				"h-8 w-8 md:h-12 md:w-12",
				"text-base",
				isActive
					? "bg-purple-100 font-bold text-purple-600"
					: "font-normal text-gray-900 hover:bg-gray-100",
			)}>
			{page}
		</button>
	);
}
