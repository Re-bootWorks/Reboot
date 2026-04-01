import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcArrowDown({
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
				d="M12.7151 15.4653C12.3975 15.7654 11.9008 15.7654 11.5832 15.4653L5.8047 10.006C5.26275 9.49404 5.6251 8.58286 6.37066 8.58286L17.9276 8.58286C18.6732 8.58286 19.0355 9.49404 18.4936 10.006L12.7151 15.4653Z"
				fill={attrs.fill}
			/>
		</svg>
	);
}
