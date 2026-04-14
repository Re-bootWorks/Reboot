import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcSearch({
	color = "gray-800",
	size = "sm", // "sm"
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ stroke: color, size });
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 24 24"
			{...props}
			fill="none">
			<path
				d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
				stroke={attrs.stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
