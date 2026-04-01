import resolveIconAttr, { IconProps, GRADIENT_MAP } from "@/utils/resolveIconAttr";

export default function IcCheckCircle({
	color = "purple-400",
	pointColor = "white",
	size = "md", // "md", "xs"
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ stroke: pointColor, from: color, to: GRADIENT_MAP[color], size });
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 24 24"
			{...props}
			fill="none">
			<circle cx="12" cy="12" r="9" fill="url(#paint0_linear_13873_27802)" />
			<path
				d="M8.5 11.8245L11.0087 14.3333L15.342 10"
				stroke={attrs.stroke}
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<defs>
				<linearGradient
					id="paint0_linear_13873_27802"
					x1="3"
					y1="12"
					x2="21"
					y2="12"
					gradientUnits="userSpaceOnUse">
					<stop stopColor={attrs.from} />
					<stop offset="1" stopColor={attrs.to} />
				</linearGradient>
			</defs>
		</svg>
	);
}
