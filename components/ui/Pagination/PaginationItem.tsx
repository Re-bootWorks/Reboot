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
				"flex h-8 w-8 items-center justify-center rounded-md transition-colors",
				isActive ? "bg-purple-400 text-white" : "text-gray-900 hover:bg-gray-200",
			)}>
			{page}
		</button>
	);
}
