import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcCalendarOutline({
	color = "gray-800",
	size = "md", // "md", "xs"
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ fill: color, size });
	return (
		<svg
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
			fill="none">
			<path
				d="M16 2V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4H18V2H16ZM19 20H5V9H19V20Z"
				fill={attrs.fill}
			/>
		</svg>
	);
}
