import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcChevronRight({
	color = "purple-500",
	size = 41, // 41
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ stroke: color, size });
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 41 41"
			{...props}
			fill="none">
			<path
				d="M8.11084 22.3887L20.5 32.7778L32.8892 22.3887"
				stroke={attrs.stroke}
				strokeWidth="4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8.11084 10.3887L20.5 20.7778L32.8892 10.3887"
				stroke={attrs.stroke}
				strokeOpacity="0.35"
				strokeWidth="4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
