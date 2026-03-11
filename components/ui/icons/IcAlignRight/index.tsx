import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcAlignRight({
	color = "gray-500",
	size = "sm", // "sm"
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ stroke: color, size });
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 20 20"
			{...props}
			fill="none">
			<path
				d="M6.66667 8.33333H17.5M3.33333 5H17.5M3.33333 11.6667H17.5M6.66667 15H17.5"
				stroke={attrs.stroke}
				strokeWidth="1.67"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
