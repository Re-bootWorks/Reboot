import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcPlus({
	color = "white",
	size = "lg", // "lg"
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ stroke: color, size });
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 32 32"
			{...props}
			fill="none">
			<path d="M8 16H24" stroke={attrs.stroke} strokeWidth="2" strokeLinecap="round" />
			<path d="M16 24V8" stroke={attrs.stroke} strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}
