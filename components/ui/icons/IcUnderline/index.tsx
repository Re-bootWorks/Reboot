import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcUnderline({
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
				d="M15.0002 3.3335V9.16683C15.0002 11.9283 12.7616 14.1668 10.0002 14.1668C7.23874 14.1668 5.00016 11.9283 5.00016 9.16683V3.3335M3.3335 17.5002H16.6668"
				stroke={attrs.stroke}
				strokeWidth="1.67"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
