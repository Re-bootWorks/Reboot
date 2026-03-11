import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcChevronRight({
	color = "gray-400",
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
				d="M8.53564 13.8994L12.8993 9.53575L8.53564 5.17209"
				stroke={attrs.stroke}
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
