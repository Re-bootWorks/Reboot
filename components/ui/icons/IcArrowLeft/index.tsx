import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcArrowLeft({
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
				d="M7.97513 12.8577C7.67503 12.5401 7.67503 12.0434 7.97512 11.7258L13.4344 5.94728C13.9464 5.40533 14.8576 5.76768 14.8576 6.51324L14.8576 18.0702C14.8576 18.8158 13.9464 19.1781 13.4344 18.6362L7.97513 12.8577Z"
				fill={attrs.fill}
			/>
		</svg>
	);
}
