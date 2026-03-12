import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcChevronDown({
	color = "gray-500",
	size = 17, // 17
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ stroke: color, size });
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 17 17"
			{...props}
			fill="none">
			<path
				d="M5 7.53564L8.53553 11.0712L12.0711 7.53564"
				stroke={attrs.stroke}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
