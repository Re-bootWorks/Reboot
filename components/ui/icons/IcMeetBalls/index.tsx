import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcMeetBalls({
	color = "gray-500",
	size = "md", // "md", "xl"
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
			<circle cx="6.14917" cy="12.291" r="1.5" fill={attrs.fill} />
			<circle cx="12.1492" cy="12.291" r="1.5" fill={attrs.fill} />
			<circle cx="18.1492" cy="12.291" r="1.5" fill={attrs.fill} />
		</svg>
	);
}
