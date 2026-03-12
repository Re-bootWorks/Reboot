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
			className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
				isActive ? "bg-purple-300 text-white" : "text-gray-600 hover:bg-gray-100"
			} `}>
			{page}
		</button>
	);
}
