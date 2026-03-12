import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
	variant?: "default" | "outlined";
	inputSize?: "sm" | "md" | "lg";
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
	/*
   - const { ClassNames, variant, inputSize, ...rest } = props 을 한줄로 줄인것
     ({ ClassNames, variant = "default", inputSize="md", ...props }, ref)
    - ...props 는 특정 props를 제외한 나머지 props를 모아두는 객체
 */
	({ className, variant = "default", inputSize = "md", ...props }, ref) => {
		const sizeStyles = {
			sm: "h-10 text-sm px-6",
			md: "h-12 text-base px-10",
			lg: "h-14 text-lg px-12",
		};

		const variantStyles = {
			default:
				"bg-gray-50 border-none hover:bg-white hover:ring-2 hover:ring-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-500",
			outlined:
				"bg-white border border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500",
		};

		return (
			<div className="relative w-full">
				<input
					ref={ref}
					type="search"
					className={cn(
						// 기본 input 스타일
						"w-full rounded-full pr-12 transition-all outline-none",
						// placeholder 스타일
						"placeholder:text-gray-500",
						// size
						sizeStyles[inputSize],
						// variant
						variantStyles[variant],
						// 외부 스타일
						className,
					)}
					{...props}
				/>
				{/* 검색 버튼 */}
				<button
					type="button"
					className="absolute top-0 right-3 bottom-0 flex items-center transition-colors hover:text-gray-600"
					aria-label="검색">
					{/* 검색 이미지 */}
					<svg
						width="24"
						height="24"
						viewBox=" 0 0 24 24"
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
