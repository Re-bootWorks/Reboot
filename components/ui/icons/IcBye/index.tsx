import resolveIconAttr, { IconProps, GRADIENT_MAP } from "@/utils/resolveIconAttr";

export default function IcBye({
	color = "purple-400",
	pointColor = "purple-300",
	size = "md", // "md"
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ stroke: pointColor, from: color, to: GRADIENT_MAP[color], size });
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 24 24"
			{...props}
			fill="none">
			<path
				d="M8.59033 5.55469C9.07648 5.06881 9.86503 5.06864 10.3511 5.55469L17.6938 12.8984C17.7324 12.8334 17.7817 12.6996 17.7817 12.4834C17.7817 12.1439 15.7453 8.40946 17.3296 7.73047C18.9138 7.0517 20.0451 12.0305 20.7241 13.2754C21.4031 14.5202 22.8741 16.8962 19.7056 20.4043C16.5369 23.9124 11.8973 22.2152 10.313 20.6309C9.58225 19.9001 8.88984 19.1837 8.26904 18.5352C8.26375 18.53 8.25767 18.5257 8.25244 18.5205L3.61084 13.8789C3.12499 13.3928 3.12481 12.6042 3.61084 12.1182C4.09688 11.6321 4.88543 11.6323 5.37158 12.1182L8.84619 15.5928L9.01807 15.4385L3.8374 10.2578C3.35127 9.77168 3.35127 8.9832 3.8374 8.49707C4.32343 8.01129 5.11108 8.01138 5.59717 8.49707L10.8667 13.7656L11.0376 13.6104L5.42139 7.99414C4.93573 7.50811 4.93575 6.72042 5.42139 6.23438C5.90752 5.74824 6.696 5.74824 7.18213 6.23438L12.8862 11.9385L13.0571 11.7832L8.59033 7.31543C8.1042 6.8293 8.1042 6.04082 8.59033 5.55469Z"
				fill="url(#paint0_linear_13873_27792)"
			/>
			<path
				d="M12.3975 2.9707C12.8189 2.95467 13.8212 3.11913 14.4588 3.9052C15.0965 4.69128 15.2717 5.65701 15.2795 6.04162"
				stroke={attrs.stroke}
				strokeWidth="1.19251"
				strokeLinecap="round"
			/>
			<path
				d="M15.1719 1.29297C15.4326 1.28355 16.0528 1.38769 16.4484 1.87964C16.844 2.37159 16.9537 2.97512 16.9591 3.21539"
				stroke={attrs.stroke}
				strokeWidth="1.19251"
				strokeLinecap="round"
			/>
			<path
				d="M7.33789 20.6328C6.92011 20.6905 5.90647 20.6262 5.19408 19.9071C4.4817 19.1881 4.21172 18.2444 4.16578 17.8625"
				stroke={attrs.stroke}
				strokeWidth="1.19251"
				strokeLinecap="round"
			/>
			<path
				d="M4.74414 22.5771C4.48566 22.6123 3.85812 22.5702 3.41575 22.1198C2.97338 21.6695 2.80441 21.0798 2.77522 20.8412"
				stroke={attrs.stroke}
				strokeWidth="1.19251"
				strokeLinecap="round"
			/>
			<defs>
				<linearGradient
					id="paint0_linear_13873_27792"
					x1="3.24658"
					y1="13.828"
					x2="21.6628"
					y2="13.828"
					gradientUnits="userSpaceOnUse">
					<stop stopColor={attrs.from} />
					<stop offset="1" stopColor={attrs.to} />
				</linearGradient>
			</defs>
		</svg>
	);
}
