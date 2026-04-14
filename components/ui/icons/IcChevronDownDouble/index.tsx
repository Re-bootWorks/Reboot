import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcChevronDownDouble({
	color = "purple-500",
	size = 41,
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ stroke: color, size });

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 41 41"
			fill="none"
			{...props}>
			<path
				d="M8.11133 22.3887L20.5005 32.7778L32.8896 22.3887"
				stroke={attrs.stroke}
				strokeWidth="4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8.11133 10.3887L20.5005 20.7778L32.8896 10.3887"
				stroke={attrs.stroke}
				strokeOpacity="0.35"
				strokeWidth="4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
