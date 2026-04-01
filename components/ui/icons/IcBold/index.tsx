import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcBold({
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
				d="M5 10.0002H11.6667C13.5076 10.0002 15 8.50778 15 6.66683C15 4.82588 13.5076 3.3335 11.6667 3.3335H5V10.0002ZM5 10.0002H12.5C14.3409 10.0002 15.8333 11.4925 15.8333 13.3335C15.8333 15.1744 14.3409 16.6668 12.5 16.6668H5V10.0002Z"
				stroke={attrs.stroke}
				strokeWidth="1.67"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
