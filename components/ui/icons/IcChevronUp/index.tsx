import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcChevronUp({
	color = "white",
	size = "sm", // "sm"
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ stroke: color, size });
	return (
		<>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={attrs.size}
				height={attrs.size}
				viewBox="0 0 20 20"
				fill="none"
				{...props}>
				<path
					d="M14.3574 11.0034L9.99376 6.63976L5.6301 11.0034"
					stroke={attrs.stroke}
					strokeWidth="1.4"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</>
	);
}
