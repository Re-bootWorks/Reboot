import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
	variant?: "default" | "outlined";
	onSearchClick?: () => void;
	onClear?: () => void;
}

const variantStyles = {
	default:
		"bg-gray-50 border-none hover:bg-white hover:ring-2 hover:ring-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-500",
	outlined:
		"bg-white border border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500",
} as const;

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
	({ className, variant = "default", onSearchClick, onClear, value, ...props }, ref) => {
		const hasValue = value !== undefined && value !== "";

		return (
			<div className="relative w-94">
				<input
					ref={ref}
					type="search"
					value={value}
					className={cn(
						"w-full rounded-full transition-all outline-none",
						"h-11 px-8 text-base",
						"placeholder:text-gray-500",
						"[&::-webkit-search-cancel-button]:appearance-none",
						"[&::-webkit-search-decoration]:appearance-none",
						hasValue ? "pr-20" : "pr-12",
						variantStyles[variant],
						className,
					)}
					{...props}
				/>

				{hasValue && onClear && (
					<button
						type="button"
						onClick={onClear}
						className="absolute top-0 right-12 bottom-0 flex items-center transition-colors"
						aria-label="입력 내용 지우기">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="text-purple-500 hover:text-purple-700">
							<path
								d="M5.5 5L18.5 18"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
							/>
							<path
								d="M18.5 5L5.5 18"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				)}

				<button
					type="button"
					onClick={onSearchClick}
					className="absolute top-0 right-3 bottom-0 flex items-center text-gray-600 transition-colors hover:text-gray-900"
					aria-label="검색">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5">
						<path
							d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>
		);
	},
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
