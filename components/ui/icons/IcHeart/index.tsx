import resolveIconAttr, { IconProps, GRADIENT_MAP } from "@/utils/resolveIconAttr";

export default function IcHeart({
	isGradient = false,
	color = !isGradient ? "gray-200" : "purple-400",
	size = "md",
	...props
}: IconProps) {
	const attrs = resolveIconAttr({
		size,
		...(!isGradient ? { fill: color } : { from: color, to: GRADIENT_MAP[color] }),
	});

	const gradientId = "heart-gradient";

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 24 24"
			fill="none"
			{...props}>
			{isGradient && (
				<defs>
					<linearGradient
						id={gradientId}
						x1="1.3335"
						y1="14.6663"
						x2="30.6668"
						y2="14.6663"
						gradientUnits="userSpaceOnUse">
						<stop stopColor={attrs.from} />
						<stop offset="1" stopColor={attrs.to} />
					</linearGradient>
				</defs>
			)}
			<path
				d="M22.1 9.1C22 5.7 19.3 3 15.9 3C14.8 3 13.1 3.8 12.4 5.1C12.3 5.4 11.9 5.4 11.8 5.1C11 3.9 9.4 3.1 8.2 3.1C4.9 3.1 2.1 5.8 2 9.1V9.3C2 11 2.7 12.6 3.9 13.8C3.9 13.8 3.9 13.8 3.9 13.9C4 14 8.8 18.2 11 20.1C11.6 20.6 12.5 20.6 13.1 20.1C15.3 18.2 20 14 20.2 13.9C20.2 13.9 20.2 13.9 20.2 13.8C21.4 12.7 22.1 11.1 22.1 9.3V9.1Z"
				fill={!isGradient ? attrs.fill : `url(#${gradientId})`}
			/>
		</svg>
	);
}
