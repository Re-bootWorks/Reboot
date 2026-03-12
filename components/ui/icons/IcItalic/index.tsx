import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcItalic({
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
				d="M15.8332 3.3335H8.33317M11.6665 16.6668H4.1665M12.4998 3.3335L7.49984 16.6668"
				stroke={attrs.stroke}
				strokeWidth="1.67"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
