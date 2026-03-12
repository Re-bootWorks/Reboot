import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcCheck({
	color = "purple-500",
	size = "md", // "md"
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ stroke: color, size });
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 24 24"
			{...props}
			fill="none">
			<path
				d="M20 6L9 17L4 12"
				stroke={attrs.stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
