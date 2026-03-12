import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcDelete({
	color = "gray-600",
	size = "md", // "md", "xs"
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
			<path d="M5.5 5L18.5 18" stroke={attrs.stroke} strokeWidth="1.8" strokeLinecap="round" />
			<path d="M18.5 5L5.5 18" stroke={attrs.stroke} strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}
