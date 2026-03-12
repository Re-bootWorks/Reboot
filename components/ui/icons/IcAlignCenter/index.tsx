import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcAlignCenter({
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
				d="M15 8.33333H5M17.5 5H2.5M17.5 11.6667H2.5M15 15H5"
				stroke={attrs.stroke}
				strokeWidth="1.67"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
