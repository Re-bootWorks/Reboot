import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcArrowUp({
	color = "gray-800",
	size = "md", // "md"
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ fill: color, size });
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 24 24"
			{...props}
			fill="none">
			<path
				d="M12.7151 9.11771C12.3975 8.81761 11.9008 8.81761 11.5832 9.1177L5.8047 14.577C5.26275 15.089 5.6251 16.0001 6.37066 16.0001L17.9276 16.0001C18.6732 16.0001 19.0355 15.089 18.4936 14.577L12.7151 9.11771Z"
				fill={attrs.fill}
			/>
		</svg>
	);
}
